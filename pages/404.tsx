import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import {
  Button,
  Container,
  Group,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "./page";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

const NotFound: NextPageWithLayout = () => {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>سوقنا | 404!</title>
        <meta name="description" content="404! الصفحة مهيب موجودة." />
      </Head>
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>خطأ 404: الصفحة مهيب موجودة</Title>
        <Text
          color="dimmed"
          size="lg"
          align="center"
          className={classes.description}
        >
          المعذرة، بس الصفحة اللي تدور عليها يبدو أنها ضاعت. 
          تفضل بالرجوع للصفحة الرئيسية وكمل تصفحك في موقعنا.
        </Text>
        <Group position="center">
          <Link href="/">
            <Button variant="subtle" size="md">
              رجعني للصفحة الرئيسية
            </Button>
          </Link>
        </Group>
      </Container>
    </>
  );
};

export default NotFound;

NotFound.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
