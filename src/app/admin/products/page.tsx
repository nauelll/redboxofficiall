// /admin/products — redirect to main admin dashboard (which has the products list).
import { redirect } from "next/navigation";
export default function AdminProductsPage() {
  redirect("/admin");
}
