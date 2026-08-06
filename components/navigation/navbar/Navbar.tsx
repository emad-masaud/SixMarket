import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Header,
  HoverCard,
  Indicator,
  Loader,
  Menu,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconNotification,
  IconPlus,
  IconSettings,
  IconTags,
  IconUser,
} from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { navbarStyles } from "./Navbar.styles";

import { Notification } from "@prisma/client";
import {
  IconBriefcase,
  IconCar,
  IconHome,
  IconTag,
  IconTools,
  IconUsers,
} from "@tabler/icons-react";
import axios from "axios";

export const dropdownMenuData = [
  {
    icon: IconTag,
    title: "بيع وشراء",
    description: "تصفح واشتر من مجموعة واسعة من المنتجات",
    slug: "buy-and-sell",
  },
  {
    icon: IconCar,
    title: "مركبات",
    description: "اكتشف السيارات والمواتر الجديدة والمستعملة",
    slug: "vehicles",
  },
  {
    icon: IconBriefcase,
    title: "وظايف",
    description:
      "دور على فرص عمل، دوام جزئي، وأعمال حرة",
    slug: "jobs",
  },
  {
    icon: IconTools,
    title: "خدمات",
    description:
      "تصفح الخدمات المهنية مثل التصليح، التنظيف، والتدريس",
    slug: "services",
  },
  {
    icon: IconUsers,
    title: "مجتمعنا",
    description:
      "تواصل مع جيرانك وأهل حارتك",
    slug: "community",
  },
];

export interface INavbar {}

const Navbar: FC<INavbar> = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme, cx } = navbarStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<
    Notification[]
  >([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    useState<number>();

  const { data, status } = useSession();
  const user = data?.user;
  const router = useRouter();

  // GET notifications from '/api/notifications/getUnreadNotifications'
  useEffect(() => {
    async function getUnreadNotifications() {
      const unreadNotifications: Notification[] = (
        await axios.get(
          // @ts-expect-error
          `/api/notifications/getUnreadNotifications?userId=${user.id}`
        )
      ).data;

      setUnreadNotifications(unreadNotifications);
      setUnreadNotificationsCount(unreadNotifications.length);
    }

    // Only run if there's a user
    if (status === "authenticated") {
      getUnreadNotifications();
    }
  }, [status]);

  const links = dropdownMenuData.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <Link
          href={`/categories/${item.slug}`}
          className="text-decoration-none no-underline"
        >
          <Text size="sm" fw={500} className="text-slate-900">
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </Link>
      </Group>
    </UnstyledButton>
  ));

  // User menu: menu | loader | "Log in"
  let userMenu;

  if (status === "authenticated") {
    userMenu = (
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          {/* User button */}
          <UnstyledButton
            className={cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })}
          >
            <Group spacing={7}>
              {/* If there's unread notifications, show an indicator */}
              {unreadNotificationsCount! > 0 ? (
                <Indicator
                  inline
                  label={unreadNotificationsCount}
                  size={18}
                  withBorder
                >
                  <Avatar
                    src={user?.image || ""}
                    alt={
                      `${user?.name}'s profile picture` ||
                      "Default profile picture"
                    }
                    radius="xl"
                    size={32}
                  />
                </Indicator>
              ) : (
                <Avatar
                  src={user?.image || ""}
                  alt={
                    `${user?.name}'s profile picture` ||
                    "Default profile picture"
                  }
                  radius="xl"
                  size={32}
                />
              )}

              <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                {user?.name}
              </Text>
              <IconChevronDown size={rem(12)} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Link href="/profile/my-listings" className="no-underline">
            <Menu.Item
              icon={
                <IconTags
                  size="0.9rem"
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              }
            >
              إعلاناتي
            </Menu.Item>
          </Link>

          <Link href="/profile/favourites" className="no-underline">
            <Menu.Item
              icon={
                <IconHeart
                  size="0.9rem"
                  color={theme.colors.red[6]}
                  stroke={1.5}
                />
              }
            >
              المفضلة
            </Menu.Item>
          </Link>

          <Link href="/profile/notifications" className="no-underline">
            <Menu.Item
              className="flex"
              icon={
                <IconNotification
                  size="0.9rem"
                  // color={theme.colors.red[6]}
                  stroke={1.5}
                />
              }
            >
              الإشعارات
              <Badge color="red" size="xs" variant="filled" className="mr-2">
                {unreadNotificationsCount}
              </Badge>
            </Menu.Item>
          </Link>

          <Menu.Label>الإعدادات</Menu.Label>
          <Link href="/profile/" className="no-underline">
            <Menu.Item icon={<IconUser size="0.9rem" stroke={1.5} />}>
              حسابي
            </Menu.Item>
          </Link>
          <Link href="/profile/settings" className="no-underline">
            <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
              إعدادات الحساب
            </Menu.Item>
          </Link>
          <Menu.Divider />
          <Menu.Item
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
            icon={<IconLogout size="0.9rem" stroke={1.5} />}
          >
            تسجيل خروج
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  } else if (status === "loading") {
    userMenu = <Loader size={"sm"} />;
  } else if (status === "unauthenticated") {
    userMenu = (
      <Button
        variant="light"
        onClick={() => signIn(undefined, { callbackUrl: "/" })}
      >
        دخول
      </Button>
    );
  }

  return (
    <Box>
      <Header height={60}>
        <Group
          className="max-w-6xl w-full mx-auto sm:px-4 px-6"
          position="apart"
          sx={{ height: "100%" }}
        >
          <Link href={"/"}>
            <Image
              src={"/MarketplaceLogo.svg"}
              height={35}
              width={150}
              alt="Marketpalce logo"
            />
          </Link>

          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              الرئيسية
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" ml={5}>
                      الأقسام
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text fw={500}>الأقسام</Text>
                  <Anchor component={Link} fz={"xs"} href="/categories">
                    عرض الكل
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="/about" className={classes.link}>
              من نحن
            </a>
          </Group>

          <Group className={classes.hiddenMobile}>
            {userMenu}
            <Button
              rightIcon={<IconPlus size="0.9rem" color={theme.colors.dark[9]} />}
              onClick={
                status === "authenticated"
                  ? () => {
                      router.push("/listings/new");
                    }
                  : () => {
                      signIn(undefined, { callbackUrl: "/listings/new" });
                    }
              }
              variant="default"
            >
              نزل إعلانك
            </Button>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      {/* Mobile menu */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="القائمة"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          {/* Profile links */}
          {status === "authenticated" && (
            <>
              <Divider
                my="sm"
                color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
              />
              <Link
                href="/profile/"
                style={{ textDecoration: "none", color: "black" }}
                onClick={toggleDrawer}
              >
                <Group p={"sm"}>
                  <Avatar
                    src={user?.image || ""}
                    alt={
                      `${user?.name}'s profile picture` ||
                      "Default profile picture"
                    }
                    radius="xl"
                    size={32}
                  />

                  <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      {user?.name}
                    </Text>

                    <Text color="dimmed" size="xs">
                      {user?.email}
                    </Text>
                  </div>
                </Group>
              </Link>
              <Menu>
                <Menu.Label>الملف الشخصي</Menu.Label>

                {/* Mobile - Profile */}
                <Link
                  href="/profile/"
                  onClick={toggleDrawer}
                  className="no-underline"
                >
                  <Menu.Item
                    className={classes.link}
                    icon={<IconUser size="0.9rem" stroke={1.5} />}
                    sx={{
                      backgroundColor: "white",
                    }}
                  >
                    حسابي
                  </Menu.Item>
                </Link>

                {/* Mobile - My Listings */}
                <Link
                  href="/profile/my-listings"
                  onClick={toggleDrawer}
                  className="no-underline"
                >
                  <Menu.Item
                    className={classes.link}
                    icon={<IconTags size="0.9rem" stroke={1.5} />}
                  >
                    إعلاناتي
                  </Menu.Item>
                </Link>

                {/* Mobile - Favourites */}
                <Link
                  href="/profile/favourites"
                  onClick={toggleDrawer}
                  className="no-underline"
                >
                  <Menu.Item
                    className={classes.link}
                    icon={
                      <IconHeart
                        size="0.9rem"
                        color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    المفضلة
                  </Menu.Item>
                </Link>

                {/* Mobile - Notifications */}
                <Link href="/profile/notifications" className="no-underline">
                  <Menu.Item
                    className={classes.link}
                    icon={
                      <IconNotification
                        size="0.9rem"
                        // color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    الإشعارات
                    <Badge
                      color="red"
                      size="xs"
                      variant="filled"
                      className="ml-2"
                    >
                      {unreadNotificationsCount}
                    </Badge>
                  </Menu.Item>
                </Link>
              </Menu>
            </>
          )}

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Menu>
            {status === "authenticated" && <Menu.Label>تصفح الموقع</Menu.Label>}
            <Link href="/" className={classes.link} onClick={toggleDrawer}>
              الرئيسية
            </Link>
            <Link
              href="/categories"
              className={classes.link}
              onClick={toggleDrawer}
            >
              الأقسام
            </Link>
            <Link href="/about" className={classes.link} onClick={toggleDrawer}>
              من نحن
            </Link>
          </Menu>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Group position="center" grow pb="xl" px="md">
            {status === "authenticated" ? (
              <>
                <Button
                  variant="light"
                  color="red"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  تسجيل خروج
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="filled"
                  onClick={() => signIn(undefined, { callbackUrl: "/" })}
                >
                  دخول
                </Button>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Navbar;
