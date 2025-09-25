import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useParams} from "next/navigation";
import { usePathname,useRouter } from "@/i18n/navigation";

const LocaleSwitcherSelect = () => {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const onSelectChange = (e) => {
    const nextLocale = e.target.value;
    console.log(locale);
    router.replace({pathname,params},{locale: nextLocale})
  }
  return (
    <>
    <label>
        🌐
        <select defaultValue={locale} label={t('label')} onChange={onSelectChange}>
            {routing.locales.map((cur) => (
                <option key={cur} value={cur}>
                    {t('locale',{locale: cur})}
                </option>
            ))}
        </select>
    </label>
    </>
  )
}

export default LocaleSwitcherSelect