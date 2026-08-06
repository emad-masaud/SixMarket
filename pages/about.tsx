import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import { Container, Title, Text } from "@mantine/core";
import Head from "next/head";
import { NextPageWithLayout } from "./page";

const About: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>سوقنا | من نحن</title>
      </Head>
      <Container size="md" py="xl">
        <Title order={1} mb="lg">من نحن</Title>
        <Text mb="sm" size="lg">
          سوقنا هو منصتك الإلكترونية الشاملة لبيع وشراء كل ما تحتاجه بكل سهولة وموثوقية.
          نطمح لتوفير بيئة آمنة تجمع بين البائع والمشتري وتسهل عليهم إنجاز الصفقات بأفضل تجربة مستخدم.
        </Text>
      </Container>
    </>
  );
};

export default About;

About.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
