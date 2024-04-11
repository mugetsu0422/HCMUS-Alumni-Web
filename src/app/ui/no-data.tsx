import Link from 'next/link';
 
export default function NoData() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <h2 className="text-xl font-semibold">Không tìm thấy dữ liệu</h2>
    </main>
  );
}