import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";

const PrivacyPolicy = () => {
  const {t} = useTranslation();

  // useEffect(() => {
  //   window.location.href = '/tiktokWj7z2Zy8i8ATnzII3320Oa2sk7alc34c.txt';
  // }, []);

  return (
    <>
      <header className="container">
        <Link to='/' className="hidden lg:flex items-center py-6 gap-4">
          <img className="w-16 h-16 rounded-2xl dark:hidden" src={logoLightIcon} alt="logo" />
          <img className="w-16 h-16 rounded-2xl hidden dark:block" src={logoIcon} alt="logo" />
          <h3 className={`dark:text-white text-xl font-semibold`}>
            crawltomedia
          </h3>
        </Link>
      </header>
      <div className="dark:text-white container py-10 px-1">
        <h1 className='text-center font-bold text-4xl mb-20'>
          {t('privacyPolicy.title')}
        </h1>

        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('privacyPolicy.introduction_title')}
          </h2>
          <p className="opacity-80">
            {t('privacyPolicy.introduction')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('privacyPolicy.sections.informationWeCollect.title')}
          </h2>
          <p className="opacity-80">
            {t('privacyPolicy.sections.informationWeCollect.text')}
          </p>
          <ol className="mt-4 flex flex-col gap-2">
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                1
              </span>
              <p>
              {t('privacyPolicy.sections.informationWeCollect.content.accountInformation')}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                2
              </span>
              <p>
              {t('privacyPolicy.sections.informationWeCollect.content.oauthTokens')}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                3
              </span>
              <p>
              {t('privacyPolicy.sections.informationWeCollect.content.usageData')}
              </p>
            </li>
            <li className="opacity-90 flex gap-4 items-center mt-1">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                4
              </span>
              <div>
              <p>
              {t('privacyPolicy.sections.informationWeCollect.content.deviceInformation')}
              </p>
              </div>
            </li>
            <li className="opacity-90 flex gap-4 mt-1">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                5
              </span>
              <div>
                <p>{t('privacyPolicy.sections.informationWeCollect.content.cookies')}</p>
              </div>
              </li>
            </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.howWeUseYourInformation.title')}
          </h2>
          <div>
            <p className="opacity-80 mb-4">
            {t('privacyPolicy.sections.howWeUseYourInformation.text')}
            </p>
            <ol className="list-disc ml-10 opacity-90 flex flex-col gap-4">
              <li>
              {t('privacyPolicy.sections.howWeUseYourInformation.content.1')}
              </li>
              <li>
              {t('privacyPolicy.sections.howWeUseYourInformation.content.2')}
              </li>
              <li>
              {t('privacyPolicy.sections.howWeUseYourInformation.content.3')}
              </li>
              <li>
              {t('privacyPolicy.sections.howWeUseYourInformation.content.4')}
              </li>
              <li>
              {t('privacyPolicy.sections.howWeUseYourInformation.content.5')}
              </li>
            </ol>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.sharingYourInformation.title')}
          </h2>
          <div>
            <p className="opacity-80">
            {t('privacyPolicy.sections.sharingYourInformation.text')}
            </p>
            <div className="py-2">
              <h3 className="text-lg opacity-90">
                {t('privacyPolicy.sections.sharingYourInformation.content.serviceProviders.title')}
              </h3>
              <p className="opacity-80">
                {t('privacyPolicy.sections.sharingYourInformation.content.serviceProviders.text')}
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg opacity-90">
                {t('privacyPolicy.sections.sharingYourInformation.content.legalCompliance.title')}
              </h3>
              <p className="opacity-80">
                {t('privacyPolicy.sections.sharingYourInformation.content.legalCompliance.text')}
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg opacity-90">
                {t('privacyPolicy.sections.sharingYourInformation.content.protectionOfRights.title')}
              </h3>
              <p className="opacity-80">
                {t('privacyPolicy.sections.sharingYourInformation.content.protectionOfRights.text')}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-10">
        <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.dataSecurity.title')}
          </h2>
          <p className="opacity-80">
          {t('privacyPolicy.sections.dataSecurity.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.dataRetention.title')}
          </h2>
          <p className="opacity-80">
          {t('privacyPolicy.sections.dataRetention.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.yourRights.title')}
          </h2>
          <div>
            <p className="opacity-80 mb-4">
            {t('privacyPolicy.sections.yourRights.text')}
            </p>
            <ol className="list-disc ml-10 opacity-90 flex flex-col gap-4">
              <li>
              {t('privacyPolicy.sections.yourRights.content.1')}
              </li>
              <li>
              {t('privacyPolicy.sections.yourRights.content.2')}
              </li>
              <li>
              {t('privacyPolicy.sections.yourRights.content.3')}
              </li>
            </ol>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.cookiesAndChoices.title')}
          </h2>
          <div>
            <p className="opacity-80 mb-2">
            {t('privacyPolicy.sections.cookiesAndChoices.text')}
            </p>
            <div className="py-2">
              <h3 className="text-lg opacity-90">
              {t('privacyPolicy.sections.cookiesAndChoices.content.1.title')}
              </h3>
              <p className="opacity-80">
              {t('privacyPolicy.sections.cookiesAndChoices.content.1.text')}
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg opacity-90">
              {t('privacyPolicy.sections.cookiesAndChoices.content.2.title')}
              </h3>
              <p className="opacity-80">
              {t('privacyPolicy.sections.cookiesAndChoices.content.2.text')}
              </p>
            </div>
            <div className="py-2">
            <h3 className="text-lg opacity-90">
              {t('privacyPolicy.sections.cookiesAndChoices.content.3.title')}
              </h3>
              <p className="opacity-80">
              {t('privacyPolicy.sections.cookiesAndChoices.content.3.text')}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
          {t('privacyPolicy.sections.thirdPartyServices.title')}
          </h2>
          <p className="opacity-80">
          {t('privacyPolicy.sections.thirdPartyServices.content')}
          </p>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy