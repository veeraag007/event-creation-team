// Shared document layout and metadata, using system fonts for offline and Docker builds.
import "./globals.css";

export const metadata = {
  title: "Community 360 | Event Creation",
  description: "Organize, discover and book community events in one platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
