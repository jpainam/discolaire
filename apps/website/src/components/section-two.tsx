import Image from "next/image";
import computer from "public/computer.png";

export function SectionTwo() {
  return (
    <section className="container mb-12 overflow-hidden md:pb-0">
      <div className="flex flex-col md:flex-row md:space-x-12">
        <Image
          src={computer}
          height={346}
          width={636}
          className="-mb-[1px] object-contain"
          alt="Overview"
          quality={100}
        />

        <div className="mt-6 flex flex-col justify-center p-8 md:mb-8 md:ml-8 md:max-w-[40%] md:p-0">
          <h3 className="mb-4 text-xl font-medium md:text-2xl">
            Vue d'ensemble financière
          </h3>

          <p className="mb-4 text-sm text-[#878787]">
            Connectez votre propre système de paiement. Nous nous intégrons à
            plusieurs plateformes de paiement dans le monde entier. Suivez vos
            dépenses et revenus scolaires pour obtenir une vue claire de la
            situation financière de votre établissement.
          </p>

          <div className="mt-8 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={13}
              fill="none"
            >
              <path
                fill="currentColor"
                d="M6.55 13 .85 7.3l1.425-1.425L6.55 10.15 15.725.975 17.15 2.4 6.55 13Z"
              />
            </svg>
            <span className="text-sm text-[#878787]">
              Partagez des rapports financiers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
