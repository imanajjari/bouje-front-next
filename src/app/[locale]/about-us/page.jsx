import Header from "../../../components/common/Header";
import Footer from "../../../components/common/Footer";
import HeroBanner from "../../../components/common/HeroBanner";

import AboutMissionSection from "../../../components/about/AboutMissionSection";
import AboutStatsSection   from "../../../components/about/AboutStatsSection";
import ProductionSection   from "../../../components/about/ProductionSection";
import TeamSection         from "../../../components/about/TeamSection";
import ContactSection      from "../../../components/about/ContactSection";

import { createMetadata }  from "../../../lib/metadata";
import { getAboutPageData } from "../../../services/about/aboutService";

const contentByLocale = { /* ... */ };

export default async function AboutPage(context) {

  const { locale } = await context.params ?? "fa";

  let data = null;
  try {
    data = await getAboutPageData(locale);
  } catch (error) {
    console.error("Error fetching about page data:", error);
  }

  if (!data) {
    return (
      <>
        <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />
        <main className="flex items-center justify-center min-h-screen text-red-600">
          <p>خطا در بارگذاری داده‌ها.</p>
        </main>
        <Footer />
      </>
    );
  }

  const hero = data?.hero ?? null;
  const mission_cards = Array.isArray(data?.mission_cards) ? data.mission_cards : [];
  const team_cards = Array.isArray(data?.team_cards) ? data.team_cards : [];
  const production = data?.production ?? null;
  const team_members = Array.isArray(data?.team_members) ? data.team_members : [];
  const team_footer = data?.team_footer ?? null;

  return (
    <>
      <Header logoAnimation={false} iconColor="#000000" stickOnScrollOnly={true} />

      {hero && (
        <HeroBanner
          imageSrc={hero.background}
          fallbackColor="#FF0000FF"
          title={hero.title}
          description={hero.subtitle}
        />
      )}

      <main className="bg-white text-black min-h-screen font-sans">
        {mission_cards.length > 0 && <AboutMissionSection cards={mission_cards} />}
        {team_cards.length > 0 && <AboutStatsSection cards={team_cards} />}
        {production && <ProductionSection production={production} />}
        {(team_members.length > 0 || team_footer) && (
          <TeamSection members={team_members} footer={team_footer} />
        )}
        {/*
        <ContactSection />
        */}
      </main>

      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return ["fa", "en", "ar"].map((locale) => ({ locale }));
}