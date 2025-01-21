import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// icons
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";


const TermsAndConditions = () => {
  const {t} = useTranslation();

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
          {t('termsAndConditions.title')}
        </h1>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.acceptance.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.acceptance.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.description.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.description.content')}
          </p>
        </div>

        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.userResponsibilities.title')}
          </h2>
          <ol className="mt-4 flex flex-col gap-2">
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                1
              </span>
              <p>
                {t('termsAndConditions.userResponsibilities.content.1', {age: 16})}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                2
              </span>
              <p>
              {t('termsAndConditions.userResponsibilities.content.2')}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                3
              </span>
              <p>
              {t('termsAndConditions.userResponsibilities.content.3')}
              </p>
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.accountSecurity.title')}
          </h2>
          <ol className="list-disc ml-10 opacity-90 flex flex-col gap-4">
            <li>
            {t('termsAndConditions.accountSecurity.content.1')}
            </li>
            <li>
            {t('termsAndConditions.accountSecurity.content.2')}
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.thirdParty.title')}
          </h2>
          <ol className="list-disc ml-10 opacity-90 flex flex-col gap-4">
            <li>
            {t('termsAndConditions.thirdParty.content.1')}
            </li>
            <li>
            {t('termsAndConditions.thirdParty.content.2')}
            </li>
            <li>
            {t('termsAndConditions.thirdParty.content.3')}
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.cookiesPolicy.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.cookiesPolicy.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.dataPrivacy.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.dataPrivacy.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.userResponsibilities.title')}
          </h2>
          <ol className="mt-4 flex flex-col gap-2">
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                1
              </span>
              <p>
                {t('termsAndConditions.prohibitedActivities.content.1', {age: 16})}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                2
              </span>
              <p>
              {t('termsAndConditions.prohibitedActivities.content.2')}
              </p>
            </li>
            <li className="opacity-90 flex items-center gap-4">
              <span className="flex text-white items-center justify-center rounded-full min-w-8 w-8 h-8 bg-grayColor">
                3
              </span>
              <p>
              {t('termsAndConditions.prohibitedActivities.content.3')}
              </p>
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.termination.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.termination.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.liability.title')}
          </h2>
          <ol className="list-disc ml-10 opacity-90 flex flex-col gap-4">
            <li>
            {t('termsAndConditions.liability.content.1')}
            </li>
            <li>
            {t('termsAndConditions.liability.content.2')}
            </li>
            <li>
            {t('termsAndConditions.liability.content.3')}
            </li>
          </ol>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.modifications.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.modifications.content')}
          </p>
        </div>
        <div className="mb-10">
          <h2 className="font-semibold text-2xl opacity-90 mb-4">
            {t('termsAndConditions.governingLaw.title')}
          </h2>
          <p className="opacity-80">
            {t('termsAndConditions.governingLaw.content')}
          </p>
        </div>
      </div>
    </>
  )
}

export default TermsAndConditions