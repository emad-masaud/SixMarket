import { conditionOptions } from "@/components/data/formData";
import HeadingSection from "@/components/layout/heading/HeadingSection";
import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import {
  Button,
  Group,
  MultiSelect,
  NumberInput,
  Radio,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Category, Condition, Tag } from "@prisma/client";
import { IconPhoto, IconUpload, IconX, IconCheck } from "@tabler/icons-react";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "../page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";

interface IFormValues {
  files: FileWithPath[];
  name: string;
  description: string;
  condition: Condition;
  price: number;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  tags: string[];
  canDeliver: string;
  categoryId: string;
  currency: string;
}

const NewListing: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  
  const [isFree, setIsFree] = useState<Boolean>(false);
  const [tagsSearchValue, onSearchChange] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [tagsOptions, setTagsOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Get categories and tags from the database.
  useEffect(() => {
    const getCategoriesAndTags = async () => {
      // Make the API calls in parallel.
      const [categoriesRes, tagsRes] = await Promise.all([
        axios.get("/api/categories"),
        axios.get("/api/tags"),
      ]);

      const categories: Category[] = categoriesRes.data;
      const tags: Tag[] = tagsRes.data;

      const newCategoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      const newTagsOptions = tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));

      setCategoryOptions(newCategoryOptions);
      setTagsOptions(newTagsOptions);
      window.scrollTo(0, 0);
    };

    getCategoriesAndTags();
  }, []);

  const form = useForm<IFormValues>({
    initialValues: {
      files: [],
      name: "",
      description: "",
      condition: "NEW",
      price: 0,
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      tags: [],
      canDeliver: "no",
      categoryId: "",
      currency: "SAR",
    },
  });

  const handleSubmit = async (values: IFormValues) => {
    setUploading(true);
    notifications.show({
      id: "uploading",
      title: "جاري اعتماد الإعلان",
      message: "جاري رفع الصور واعتماد إعلانك...",
      loading: true,
      autoClose: false
    });

    try {
      const imageUrls = [];
      for (const file of values.files) {
        const key = `users/${(session?.user as any)?.id || 'anon'}/listings/${Date.now()}-${file.name}`;
        const uploadUrlRes = await axios.get(`/api/aws/getPresignedUploadUrl?key=${key}`);
        const uploadUrl = uploadUrlRes.data.url;
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        const s3Url = uploadUrl.split("?")[0];
        imageUrls.push(s3Url);
      }

      const adData = {
        name: values.name,
        description: values.description,
        condition: values.condition,
        price: values.price,
        location: `${values.city}, ${values.province}`,
        categoryId: values.categoryId,
        tags: values.tags,
        canDeliver: values.canDeliver === "yes",
        images: imageUrls,
        currency: values.currency,
      };

      const res = await axios.post("/api/listings/createNewListing", adData);
      notifications.hide("uploading");
      notifications.show({
        title: "تم!",
        message: "نزل إعلانك بنجاح",
        color: "green",
        icon: <IconCheck />
      });
      router.push(`/listings/${res.data.id}`);
    } catch (err) {
      console.error(err);
      notifications.hide("uploading");
      notifications.show({
        title: "خطأ",
        message: "فشل تنزيل الإعلان",
        color: "red"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`New Listing | Marketplace`}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="Create a new listing on Marketplace."
        />
        <meta property="og:title" content={`Categories | Marketplace`} />
        <meta
          property="og:description"
          content="Create a new listing on Marketplace."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Marketplace" />
      </Head>

      <HeadingSection
        title="نزل إعلانك"
        description="عبي البيانات تحت عشان تنزل إعلانك بالموقع."
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Dropzone
          onDrop={(images) => {
            form.setFieldValue("files", images);
          }}
          onReject={(images) => console.log("rejected files", images)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          {...form.getInputProps("files")}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: rem(220), pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size="3.2rem" stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size="3.2rem" stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size="3.2rem" stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                اسحب الصور هنا أو اضغط عشان تختار من جهازك
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                ارفع الصور اللي تبي، بس حجم الصورة ما يتعدى 5 ميجا
              </Text>
            </div>
          </Group>
        </Dropzone>
        <TextInput
          label="عنوان الإعلان"
          mt="md"
          placeholder="مثال: سوني 5 مستعمل أخو الجديد"
          name="title"
          {...form.getInputProps("name")}
          required
          maw={400}
        />
        <Textarea
          label="التفاصيل"
          placeholder="اكتب كل التفاصيل عن سعلتك عشان تريح الشراي"
          name="description"
          {...form.getInputProps("description")}
          mt="md"
          minRows={4}
          required
        />
        <Select
          label="القسم"
          placeholder="اختر القسم"
          name="category"
          {...form.getInputProps("categoryId")}
          maw={400}
          required
          searchable
          nothingFound="No options"
          mt="md"
          data={categoryOptions}
        />
        <Select
          label="الحالة"
          placeholder="اختر حالة السلعة"
          name="condition"
          {...form.getInputProps("condition")}
          maw={400}
          required
          mt="md"
          data={conditionOptions}
        />
        {/* Price and Currency */}
        <Group align="center" mt="md">
          <Radio
            mt={"xs"}
            value="free"
            checked={!isFree}
            onChange={() => setIsFree(false)}
          />
          <NumberInput
            label="السعر"
            {...form.getInputProps("price")}
            maw={400}
            name="price"
            // @ts-ignore
            disabled={isFree}
            defaultValue={0}
            required
            parser={(value) => value.replace(new RegExp(`(?:\\$|€|ر\\.س)\\s?|(,*)`, "g"), "")}
            formatter={(value) => {
              const currSymbol = form.values.currency === "USD" ? "$" : form.values.currency === "EUR" ? "€" : "ر.س";
              return !Number.isNaN(parseFloat(value))
                ? `${currSymbol} ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : `${currSymbol} `;
            }}
          />
          <Select
            label="العملة"
            {...form.getInputProps("currency")}
            name="currency"
            // @ts-ignore
            disabled={isFree}
            required
            data={[
              { value: "SAR", label: "ريال سعودي" },
              { value: "USD", label: "دولار أمريكي" },
              { value: "EUR", label: "يورو" },
            ]}
          />
        </Group>

        {/* Free? */}
        <Radio
          mt={"xs"}
          value="free"
          label="مجاني"
          // @ts-ignore
          checked={isFree}
          onChange={() => setIsFree(true)}
        />

        <Radio.Group
          label="تقدر توصل السلعة للمشتري؟"
          {...form.getInputProps("canDeliver")}
          name="canDeliver"
          required
          mt={"md"}
        >
          <Radio mt={"xs"} value="yes" label="إيه أقدر" />
          <Radio mt={"xs"} value="no" label="لا ما أقدر" />
        </Radio.Group>
        {/* Tags */}
        <MultiSelect
          label="الكلمات الدلالية (التاقات)"
          placeholder="اختر ٣ تاقات كحد أقصى"
          {...form.getInputProps("tags")}
          name="tags"
          data={tagsOptions}
          searchable
          searchValue={tagsSearchValue}
          maxSelectedValues={3}
          maxDropdownHeight={160}
          maw={400}
          mt="md"
          onSearchChange={onSearchChange}
          nothingFound="Nothing found"
        />

        <Button type="submit" mt="md" loading={uploading}>
          اعتمد الإعلان
        </Button>
      </form>
    </>
  );
};

export default NewListing;

NewListing.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
