import dynamic from "next/dynamic";
const Link = dynamic(() => import("next/link"));
const Image = dynamic(() => import("next/image"));

const Logo = () => {
  return (
    <Link
      href="/"
      prefetch={false}
      passHref
      className={`relative w-20 sm:w-24 md:w-28`}
    >
      <Image
        src="/images/logo.png"
        alt="Fruit Mart"
        className="object-contain"
        width={80}
        height={50}
      />
    </Link>
  );
};

export default Logo;
