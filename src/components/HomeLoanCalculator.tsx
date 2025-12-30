"use client";

import { useMemo, useState } from "react";

type Props = {
  projectName?: string;
  // optional: pass a numeric price hint (in INR)
  defaultPropertyValue?: number;
  // optional: show inside a card wrapper?
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Very tolerant parsing: tries to extract ₹ value from strings like:
// "₹4.7 Cr onwards", "Under ₹2.5 Cr", "₹21,500 / sq.ft" (will ignore sqft patterns), "Price on Request"
export function parseINRFromPriceText(price?: string): number | undefined {
  if (!price) return undefined;

  const raw = price.toLowerCase();

  // Ignore per sq.ft style pricing - not meaningful for loan principal here
  if (raw.includes("/sq") || raw.includes("sqft") || raw.includes("sq.ft")) return undefined;
  if (raw.includes("price on request") || raw.includes("por")) return undefined;

  // normalize
  const cleaned = raw.replace(/[,₹\s]/g, "");

  // patterns: 4.7cr, 2.25crore
  const cr = cleaned.match(/(\d+(\.\d+)?)(cr|crore)/);
  if (cr) return Math.round(parseFloat(cr[1]) * 1_00_00_000);

  // patterns: 75l, 75lakh
  const lk = cleaned.match(/(\d+(\.\d+)?)(l|lakh)/);
  if (lk) return Math.round(parseFloat(lk[1]) * 1_00_000);

  // patterns: plain numbers (assume INR)
  const num = cleaned.match(/(\d{6,})/); // 6+ digits to avoid "2025"
  if (num) return Math.round(parseFloat(num[1]));

  return undefined;
}

function formatINR(n: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₹${Math.round(n)}`;
  }
}

export default function HomeLoanCalculator({
  projectName,
  defaultPropertyValue,
  className = "",
}: Props) {
  const [propertyValue, setPropertyValue] = useState<number>(
    defaultPropertyValue && defaultPropertyValue > 0 ? defaultPropertyValue : 2_00_00_000
  );

  const [downMode, setDownMode] = useState<"percent" | "amount">("percent");
  const [downPercent, setDownPercent] = useState<number>(20);
  const [downAmount, setDownAmount] = useState<number>(40_00_000);

  const [annualRate, setAnnualRate] = useState<number>(9.0);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const derivedDownAmount = useMemo(() => {
    if (downMode === "amount") return clamp(downAmount, 0, propertyValue);
    return Math.round((clamp(downPercent, 0, 95) / 100) * propertyValue);
  }, [downMode, downAmount, downPercent, propertyValue]);

  const principal = useMemo(() => {
    const p = propertyValue - derivedDownAmount;
    return Math.max(0, p);
  }, [propertyValue, derivedDownAmount]);

  const { emi, totalPayable, totalInterest } = useMemo(() => {
    const n = Math.max(1, Math.round(tenureYears * 12));
    const r = Math.max(0, annualRate) / 12 / 100;

    if (principal <= 0 || r === 0) {
      const total = principal;
      const e = total / n;
      return { emi: e, totalPayable: total, totalInterest: 0 };
    }

    const pow = Math.pow(1 + r, n);
    const e = (principal * r * pow) / (pow - 1);
    const total = e * n;
    const interest = total - principal;

    return { emi: e, totalPayable: total, totalInterest: interest };
  }, [principal, annualRate, tenureYears]);

  return (
    <section className={`golden-frame modal-surface rounded-2xl p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-altina-gold">Home Loan (EMI) Calculator</h3>
          <p className="text-sm text-neutral-300 mt-1">
            Illustrative estimate{projectName ? ` for ${projectName}` : ""}. Actual terms depend on lender approval.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Property Value */}
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <label className="text-sm text-neutral-200">Property Value (₹)</label>
          <input
            type="number"
            value={propertyValue}
            min={0}
            onChange={(e) => setPropertyValue(Number(e.target.value || 0))}
            className="mt-2 w-full rounded-xl border border-altina-gold/30 bg-[#0B0B0C] px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <p className="text-xs text-neutral-400 mt-1">{formatINR(propertyValue)}</p>
        </div>

        {/* Down Payment */}
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-neutral-200">Down Payment</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDownMode("percent")}
                className={`text-xs rounded-lg px-2 py-1 border ${
                  downMode === "percent"
                    ? "border-altina-gold/60 text-altina-gold"
                    : "border-altina-gold/20 text-neutral-300"
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setDownMode("amount")}
                className={`text-xs rounded-lg px-2 py-1 border ${
                  downMode === "amount"
                    ? "border-altina-gold/60 text-altina-gold"
                    : "border-altina-gold/20 text-neutral-300"
                }`}
              >
                ₹
              </button>
            </div>
          </div>

          {downMode === "percent" ? (
            <>
              <input
                type="number"
                value={downPercent}
                min={0}
                max={95}
                onChange={(e) => setDownPercent(Number(e.target.value || 0))}
                className="mt-2 w-full rounded-xl border border-altina-gold/30 bg-[#0B0B0C] px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
              />
              <p className="text-xs text-neutral-400 mt-1">
                {downPercent}% ≈ {formatINR(derivedDownAmount)}
              </p>
            </>
          ) : (
            <>
              <input
                type="number"
                value={downAmount}
                min={0}
                max={propertyValue}
                onChange={(e) => setDownAmount(Number(e.target.value || 0))}
                className="mt-2 w-full rounded-xl border border-altina-gold/30 bg-[#0B0B0C] px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
              />
              <p className="text-xs text-neutral-400 mt-1">{formatINR(derivedDownAmount)}</p>
            </>
          )}
        </div>

        {/* Interest Rate */}
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <label className="text-sm text-neutral-200">Interest Rate (p.a.)</label>
          <input
            type="number"
            step="0.05"
            value={annualRate}
            min={0}
            onChange={(e) => setAnnualRate(Number(e.target.value || 0))}
            className="mt-2 w-full rounded-xl border border-altina-gold/30 bg-[#0B0B0C] px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <p className="text-xs text-neutral-400 mt-1">Example: 8.5% – 10.5%</p>
        </div>

        {/* Tenure */}
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <label className="text-sm text-neutral-200">Tenure (years)</label>
          <input
            type="number"
            value={tenureYears}
            min={1}
            max={35}
            onChange={(e) => setTenureYears(Number(e.target.value || 0))}
            className="mt-2 w-full rounded-xl border border-altina-gold/30 bg-[#0B0B0C] px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <p className="text-xs text-neutral-400 mt-1">{Math.round(tenureYears * 12)} months</p>
        </div>
      </div>

      {/* Results */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <p className="text-xs text-neutral-400">Loan Amount</p>
          <p className="text-lg font-semibold text-altina-ivory">{formatINR(principal)}</p>
        </div>
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <p className="text-xs text-neutral-400">Estimated EMI / month</p>
          <p className="text-lg font-semibold text-altina-gold">{formatINR(emi)}</p>
        </div>
        <div className="rounded-xl border border-altina-gold/20 p-4">
          <p className="text-xs text-neutral-400">Total Interest</p>
          <p className="text-lg font-semibold text-altina-ivory">{formatINR(totalInterest)}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-altina-gold/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-neutral-300">
            Total Payable (Principal + Interest):{" "}
            <span className="text-altina-ivory font-semibold">{formatINR(totalPayable)}</span>
          </p>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          Disclaimer: This calculator is for illustrative purposes only. Loan eligibility, EMI, interest rate, charges
          and final sanction depend on lender policies, credit profile and documentation. Please verify with your bank/NBFC.
        </p>
      </div>
    </section>
  );
}
