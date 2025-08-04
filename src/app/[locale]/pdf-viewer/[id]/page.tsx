"use client";

import { useEffect, useRef, useState } from "react";
// import { getPdfById } from "../../../../services/pdf/pdfService";
// import { useParams } from "next/navigation";
// import * as pdfjsLib from "pdfjs-dist/webpack";
// import { API_BASE_URL } from "../../api/config";

// import Header from "../../../../components/common/Header";
// import Footer from "../../../../components/common/Footer";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfViewerPage() {
  // const [pdfUrl, setPdfUrl] = useState("");
  // const [title, setTitle] = useState("");
  // const viewerRef = useRef<HTMLDivElement | null>(null);

  // 👇 تایپ دقیق پارامترها
  // const { id, locale } = useParams<{ id: string; locale: string }>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const pdf = await getPdfById(id, locale ?? "fa");
  //     if (pdf) {
  //       setPdfUrl(`${API_BASE_URL}${pdf.file}`);
  //       setTitle(pdf.title);
  //     }
  //   };
  //   fetchData();
  // }, [id, locale]);

  // useEffect(() => {
  //   if (!pdfUrl || !viewerRef.current) return;

  //   const container = viewerRef.current;
  //   container.innerHTML = "";

  //   const renderPDF = async () => {
  //     const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const viewport = page.getViewport({ scale: 1.5 });

  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d")!;
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;

  //       await page.render({ canvasContext: context, viewport }).promise;
  //       container.appendChild(canvas);
  //     }
  //   };

  //   renderPDF();
  // }, [pdfUrl]);

  // return (
  //   <>
  //     <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly />
  //     <div className="max-w-4xl mx-auto pt-20 p-4">
  //       <div ref={viewerRef} className="flex flex-col gap-6" />
  //     </div>
  //     <Footer />
  //   </>
  // );
  return (
    <>

    </>
  );
}
