'use client';


export default function AparatRawEmbed({ html }) {
  return (
    <div
      className="w-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
