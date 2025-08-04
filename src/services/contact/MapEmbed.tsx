function sanitizeEmbedCode(embedCode) {
    if (typeof window === "undefined") return embedCode;
  
    const div = document.createElement("div");
    div.innerHTML = embedCode;
  
    const iframe = div.querySelector("iframe");
    if (iframe) {
      iframe.removeAttribute("width");
      iframe.removeAttribute("height");
      iframe.removeAttribute("style");
  
      // اعمال سبک ریسپانسیو
      iframe.setAttribute(
        "style",
        "position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
      );
  
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    }
  
    return div.innerHTML;
  }
  
  export default function MapEmbed({ embedCode }) {
    const cleanedEmbed = sanitizeEmbedCode(embedCode);
  
    return (
      <div className="w-full max-w-[1000px] overflow-hidden rounded-xl shadow-md">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
          <div
            className="absolute top-0 left-0 w-full h-full"
            dangerouslySetInnerHTML={{ __html: cleanedEmbed }}
          />
        </div>
      </div>
    );
  }
  