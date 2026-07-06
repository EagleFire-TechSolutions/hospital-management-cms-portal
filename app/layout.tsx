import "../styles/style.css";

export const metadata = {
  title: "Hospital Management System",
  description: "HMS CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}