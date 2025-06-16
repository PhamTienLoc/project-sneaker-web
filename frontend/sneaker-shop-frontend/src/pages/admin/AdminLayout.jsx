import { Link, Outlet, useLocation } from "react-router-dom";

const adminMenu = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Sản phẩm", path: "/admin/products" },
  { label: "Danh mục", path: "/admin/categories" },
  { label: "Thương hiệu", path: "/admin/brands" },
  { label: "Đơn hàng", path: "/admin/orders" },
  { label: "Người dùng", path: "/admin/users" },
];

export default function AdminLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-xl border-b">Admin Panel</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {adminMenu.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded hover:bg-gray-200 ${
                    location.pathname.startsWith(item.path)
                      ? "bg-gray-200 font-semibold"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
} 