"use client";
import Barcode from "react-barcode";
export function IdCardBarCode({
  id,
  width,
  backgroundColor,
  fontSize,
  height,
}: {
  id: string;
  width?: number;
  height?: number;
  fontSize?: number;
  backgroundColor?: string;
}) {
  return (
    <Barcode
      value={"123456789012"}
      width={width}
      height={height || 40}
      background={backgroundColor}
      fontSize={fontSize || 12}
      format="UPC"
      displayValue={true}
    />
  );
}
