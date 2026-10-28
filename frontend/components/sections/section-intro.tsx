import type { ReactNode } from 'react';

export interface SectionIntroProps {
  eyebrow: string;
  title: string;
  text: string;
  action?: ReactNode;
}

export function SectionIntro({ eyebrow, title, text, action }: SectionIntroProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-[30px] mb-[30px] md:mb-[43px] 3xl:mb-[60px] 4xl:mb-[70px]">
      <div>
        <h2 className="my-2 text-navy font-manrope font-normal text-[30px] md:text-[clamp(30px,4vw,50px)] 3xl:text-[56px] 4xl:text-[64px] leading-[1.1]">
          {title}
        </h2>
        <p className="max-w-[580px] 3xl:max-w-[700px] m-0 text-cool text-[15px] 3xl:text-[17px] 4xl:text-[19px] leading-[1.7]">
          {text}
        </p>
      </div>
      {action}
    </div>
  );
}

export default SectionIntro;
