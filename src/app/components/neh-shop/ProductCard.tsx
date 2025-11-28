import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div>
      <Link href={product.url} target="_blank">
        <div className="relative w-full aspect-[4/3] bg-white rounded-md overflow-hidden">
          <Image
            src={product.thumb}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      </Link>
      <h3 className="text-lg font-semibold mt-4">{product.title}</h3>
      <div className="mt-2">
        {product.discounted ? (
          <p className="text-red-500 font-bold">
            Sale: {product.discountPrice} SEK{" "}
            <span className="line-through text-gray-400 text-sm">
              {product.normalPrice} SEK
            </span>
          </p>
        ) : (
          <p>{product.price} SEK</p>
        )}
      </div>
    </div>
  );
}
