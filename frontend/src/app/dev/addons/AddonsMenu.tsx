'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "OAuth", href: "/dev/addons/oauth" },
  // Diğer eklentiler buraya eklenebilir
];

export default function AddonsMenu() {
  const pathname = usePathname();
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-2 text-gray-700">Eklentiler</h3>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:underline font-medium ${pathname === item.href ? "text-blue-700" : "text-blue-600"}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
