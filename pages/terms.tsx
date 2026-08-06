import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import { Container, Title, Text, List } from "@mantine/core";
import Head from "next/head";
import { NextPageWithLayout } from "./page";

const Terms: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>سوقنا | شروط الاستخدام</title>
      </Head>
      <Container size="md" py="xl">
        <Title order={1} mb="lg">شروط الاستخدام</Title>
        <Text mb="sm">أهلاً بك في موقعنا. باستخدامك لهذا الموقع، فإنك توافق على الشروط والأحكام التالية:</Text>
        <List type="ordered" spacing="sm" mt="md">
          <List.Item>
            <Text fw={500}>استخدام الموقع:</Text>
            <Text size="sm">يجب استخدام الموقع لأغراض قانونية فقط، ويمنع نشر أي محتوى يخالف القوانين أو يخدش الحياء العام.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>المسؤولية:</Text>
            <Text size="sm">الموقع مجرد وسيط بين البائع والمشتري ولا يتحمل أي مسؤولية عن جودة المنتجات أو صحة المعلومات المذكورة في الإعلانات.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>الحسابات:</Text>
            <Text size="sm">أنت مسؤول بالكامل عن الحفاظ على سرية معلومات حسابك وكل الأنشطة التي تحدث تحت حسابك.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>التعديلات:</Text>
            <Text size="sm">نحتفظ بالحق في تعديل هذه الشروط في أي وقت، ويعتبر استمرارك في استخدام الموقع موافقة عليها.</Text>
          </List.Item>
        </List>
      </Container>
    </>
  );
};

export default Terms;

Terms.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
