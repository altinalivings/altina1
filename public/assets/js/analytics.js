// public/assets/js/analytics.js
// GA4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function() {
  var gaId = 'G-3Q43P5GKHK';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', gaId);
})();

// Facebook Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2552081605172608');
fbq('track', 'PageView');

// LinkedIn Partner
(function(){
  var lins = document.createElement('script'); lins.type='text/javascript'; lins.async=true;
  lins.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
  lins.onload = function(){ try{ window.lintrk = window.lintrk || function(){ (window.lintrk.q = window.lintrk.q || []).push(arguments); }; window.lintrk('init', '515682278'); }catch(e){} };
  document.head.appendChild(lins);
})();

// Google Ads (global site tag)
(function() {
  var gads = document.createElement('script'); gads.async=true;
  gads.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17510039084';
  document.head.appendChild(gads);
  window.dataLayer = window.dataLayer || [];
  function gtag2(){dataLayer.push(arguments);}
  gtag2('js', new Date());
  gtag2('config', 'AW-17510039084');
})();

// Example forwarding conversion sendTo (trigger from conversions)
window.sendConversion = function() {
  if (window.gtag) {
    gtag('event', 'conversion', {'send_to': 'AW-17510039084/L-MdCP63l44bEKz8t51B'});
  }
};
