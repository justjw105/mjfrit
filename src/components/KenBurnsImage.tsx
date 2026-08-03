import Image from 'next/image';
import { cn } from '@/lib/utils';

type KenBurnsImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageHint?: string;
};

export default function KenBurnsImage({ src, alt, className, imageHint }: KenBurnsImageProps) {
  return (
    <div className={cn("overflow-hidden w-full h-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover animate-ken-burns"
        sizes="100vw"
        priority
        data-ai-hint={imageHint}
      />
    </div>
  );
}
