import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { CountdownTimer } from "@/components/CountdownTimer";
import { LoveGame } from "@/components/LoveGame";
import { SecretLetter } from "@/components/SecretLetter";

const Index = () => (
  <Layout>
    <Hero />
    <CountdownTimer />
    <LoveGame />
    <SecretLetter />
  </Layout>
);

export default Index;
