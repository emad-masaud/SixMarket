import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import { Container, Title, Text, List } from "@mantine/core";
import Head from "next/head";
import { NextPageWithLayout } from "./page";

const Privacy: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>سوقنا | سياسة الخصوصية</title>
      </Head>
      <Container size="md" py="xl">
        <Title order={1} mb="lg">سياسة الخصوصية</Title>
        <Text mb="sm">خصوصيتك تهمنا في موقعنا. توضح هذه السياسة كيف نجمع بياناتك ونستخدمها:</Text>
        <List type="ordered" spacing="sm" mt="md">
          <List.Item>
            <Text fw={500}>جمع البيانات:</Text>
            <Text size="sm">نقوم بجمع المعلومات التي تقدمها لنا عند التسجيل أو إضافة إعلان، مثل الاسم، البريد الإلكتروني، ورقم الجوال.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>استخدام البيانات:</Text>
            <Text size="sm">تُستخدم بياناتك لتسهيل التواصل بين المستخدمين وتحسين تجربة استخدام الموقع.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>مشاركة البيانات:</Text>
            <Text size="sm">لن نقوم ببيع أو تأجير معلوماتك الشخصية لأي طرف ثالث. قد نشارك بعض البيانات فقط إذا كان ذلك مطلوباً بموجب القانون.</Text>
          </List.Item>
          <List.Item>
            <Text fw={500}>الأمان:</Text>
            <Text size="sm">نحن نتخذ الإجراءات المناسبة تقنياً لحماية بياناتك من الوصول غير المصرح به، لضمان سلامة معلوماتك.</Text>
          </List.Item>
        </List>
      </Container>
    </>
  );
};

export default Privacy;

Privacy.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
