import { Carousel } from "@mantine/carousel";
import {
  Card,
  Group,
  Image,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from "@mantine/core";
import Link from "next/link";
import { FC } from "react";

const useStyles = createStyles((theme) => ({
  price: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },

  carousel: {
    "&:hover": {
      [`& .${getStylesRef("carouselControls")}`]: {
        opacity: 1,
      },
    },
  },

  carouselControls: {
    ref: getStylesRef("carouselControls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  carouselIndicator: {
    width: rem(4),
    height: rem(4),
    transition: "width 250ms ease",

    "&[data-active]": {
      width: rem(16),
    },
  },
}));

import SaudiRiyalIcon from "../../../components/icons/SaudiRiyalIcon";

export interface IListingCard {
  images: string[];
  title: string;
  description: string;
  price?: number;
  currency?: string;
  listingId: string;
}

const ListingCard: FC<IListingCard> = ({
  title,
  description,
  images,
  price,
  currency = "SAR",
  listingId,
}) => {
  const { classes } = useStyles();

  const slides = images.map((image) => (
    <Carousel.Slide key={image}>
      <Image src={image} height={150} alt={`Image for the listing ${title}`} />
    </Carousel.Slide>
  ));

  const renderPrice = () => {
    if (!price) return "مجاني";
    if (currency === "SAR") {
      return (
        <span className="flex items-center gap-1">
          {new Intl.NumberFormat("ar-SA").format(price)}
          <SaudiRiyalIcon className="w-4 h-4 text-green-700" />
        </span>
      );
    }
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <Card radius="md" withBorder padding="xs">
      <Card.Section>
        <Carousel
          withIndicators
          loop
          classNames={{
            root: classes.carousel,
            controls: classes.carouselControls,
            indicator: classes.carouselIndicator,
          }}
        >
          {slides}
        </Carousel>
      </Card.Section>

      <Link
        href={`/listings/${listingId}`}
        className="no-underline text-decoration-none text-black"
      >
        <Group position="apart" mt="md" mb="xs" fz={"lg"}>
          <Text lineClamp={1} className="font-medium">
            {title}
          </Text>
        </Group>

        {/* <Text fz="sm" c="dimmed" mt="sm" lineClamp={1}>
        {description}
      </Text> */}

        <Group position="apart" mt="md" align="baseline">
          <div>
            <Text fz="xl" span className={classes.price}>
              {renderPrice()}
            </Text>
          </div>
        </Group>
      </Link>
    </Card>
  );
};

export default ListingCard;
