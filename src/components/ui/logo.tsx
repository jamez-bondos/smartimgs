import Image from "next/image";

export default function Logo(props: React.ComponentProps<"div">) {
  return (
    <div className="flex items-center" {...props}>
      <Image
        src="/icon.png"
        alt="Logo"
        width={24}
        height={24}
        className="mr-2"
      />
      <span className="text-2xl font-mono">
        Smart<span className="font-bold italic">IMGs</span>
      </span>
    </div>
  );
}
