export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffaf0]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-[#4a7c23]/20 border-t-[#4a7c23] animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}