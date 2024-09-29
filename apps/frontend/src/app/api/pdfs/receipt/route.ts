import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log(searchParams);
  try {
    // Launch a Puppeteer browser instance
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Use these args if deploying in a restricted environment like Vercel or Lambda
    });

    const page = await browser.newPage();

    // Use the id to navigate to a dynamic URL, or generate the content dynamically
    // Replace the URL below with your own route or dynamic content URL
    //const url = `http://localhost:3000/pdf-content/${id}`;
    const url =
      "http://localhost:3000/datum/students/fb9efa0b-1164-41d2-b9b0-3fca67acdb63/transactions/7447";
    await page.goto(url, { waitUntil: "networkidle0" });

    // Generate PDF from the page content
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    // Close the browser
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=receipt-generated.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
