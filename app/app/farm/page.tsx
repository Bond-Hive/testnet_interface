"use client";

import { ApyArrowIcon, TokenLogo } from "@/app/components/assets";
import FarmDeposit from "@/app/components/modals/farm";
import DappFooter from "@/app/components/navigations/dAppFooter";
import DAppHeader from "@/app/components/navigations/dAppHeader";
import MobileNav from "@/app/components/UI-assets/mobileNav";
import Image from "next/image";
import { useState } from "react";

const FarmPage = () => {
  const tabOptions = [
    {
      name: "Farm",
      value: "farm",
    },
    {
      name: "My Position",
      value: "myPosition",
      count: true,
      countValue: 0,
    },
  ];
  const [selectTabs, setSelectTabs] = useState<any>({
    farm: true,
  });
  const handleSelect = (selectedTab: string) => {
    setSelectTabs((prev: any) => {
      let updatedTab = { [selectedTab]: true };
      Object.keys(prev).forEach((key: any) => {
        if (key != selectedTab) {
          updatedTab[key] = false;
        }
      });
      return updatedTab;
    });
  };

  const LPavailable = true;
  const [openFarmModal, setOpenFarmModal] = useState(false)
  return (
    <>
      <div className="dapp">
        <DAppHeader />
        <div className="lg:w-10/12 md:max-lg:w-10/12 mx-auto md:pt-24 pt-8 px-5  max-w-[1500px] md:h-screen z-10">
          <div className="md:flex justify-between items-center mb-20 mt-10">
            <div className="max-md:mb-8">
              <h2 className="text-white font-semibold text-lg ">
                Farm Positions
              </h2>
              <p className="text-gray-400 text-sm">
                Farm LP tokens to receive rewards
              </p>
            </div>

            <div className="buttons text-blueish text-sm w-[328px] max-md:w-full border-2 border-border_pri rounded-xl flex">
              {tabOptions.map((tab, index) => (
                <button
                  onClick={() => handleSelect(tab.value)}
                  className={`py-2 max-md:py-3 w-1/2 flex items-center justify-center gap-2  ${
                    selectTabs[tab.value] && "shadow_button"
                  }`}
                  key={`ttab-${index}`}
                >
                  <h2>{tab.name}</h2>
                  {tab?.count && (
                    <span
                      className={`product_button flex justify-center items-center p-[2px] w-6 h-6 gap-2 rounded-full`}
                    >
                      <p className="text-sm text-gray-400 uppercase ">
                        {tab?.countValue}
                      </p>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {selectTabs["farm"] && (
            <div className="farm card1 max-w-[1500px] mx-auto px-4 max-md:px-5 py-4 mb-6 border-b border-gray-700 flex max-md:flex-col items-center md:divide-x max-md:divide-y divide-gray-600 rounded-xl">
              {LPavailable ? (
                <div className="avaliable flex max-md:flex-col max-md:justify-center max-md:items-center max-md:text-center items-start gap-3 md:w-1/2 md:py-3 max-md:pt-7 px-5 ">
                  <div className="token">
                    <Image src={TokenLogo} width={30} height={21} alt="token" />
                  </div>
                  <div className="">
                    <h2 className="text-white md:text-sm text-md mb-1">
                      Available for farming
                    </h2>
                    <div className="text-gray-400 text-lg max-md:text-xl brFirma_font mb-3 max-md:mt-3 max-md:mb-5">
                      <p>
                        <span className="text-white font-semibold">
                          $34, 828
                        </span>{" "}
                        /{" "}
                        <span className="text-blueish font-normal">
                          0.19745795 LP
                        </span>
                      </p>
                    </div>
                    <h2 className="text-blueish text-sm ">Get More</h2>
                  </div>
                </div>
              ) : (
                <div className="unavaliable flex max-md:flex-col items-center gap-3 md:w-1/2 max-md:text-center py-5">
                  <div className="token max-md:my-4">
                    <Image src={TokenLogo} width={77} height={55} alt="token" />
                  </div>
                  <div className="">
                    <h2 className="text-white font-semibold text-md">
                      You don’t have LP tokens for farm yet
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Your available LP will appear here once you provide
                      liquidity
                    </p>
                  </div>
                </div>
              )}

              <div className="get_LP_tokens flex items-center gap-3 w-1/2 max-md:w-full px-5 py-3 justify-between max-md:my-7 max-md:pt-7 ">
                <div className="rewards text-gray-400 text-md">
                  <h2 className="text-md mb-2 max-sm:text-sm">Rewards :bhUSD</h2>
                  <p className="text-md max-sm:text-sm">Farm APR</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-10 ">
                  <div className="APY text-blueish  w-3/12 brFirma_font">
                    <h1 className="text-lg mb-1 max-sm:text-md">12.65%</h1>
                    <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px]">
                      <Image
                        src={ApyArrowIcon}
                        width={14}
                        height={14}
                        alt="right"
                        className=""
                      />{" "}
                      <p className="text-[13px]  text-[#A586FE]">
                        2.1% vs. last month
                      </p>
                    </div>
                  </div>
                  <button className="button2 px-5 py-1 text-[12px] max-md:hidden" onClick={() => setOpenFarmModal(true)}>
                    {LPavailable ? "Farm" : "Get LP tokens"}
                  </button>
                </div>
              
              </div>
              <button className="button2 px-5 py-3 text-md max-md:block hidden w-full " onClick={() => setOpenFarmModal(true)}>
                    {LPavailable ? "Farm" : "Get LP tokens"}
                  </button>
              </div>

          )}

          {selectTabs["myPosition"] && (
            <div className="farm card1 max-w-[1500px] mx-auto px-4 py-4 mb-6 border-b border-gray-700 flex items-center divide-x divide-gray-600 h-[437px]">
              <div className="h-52 text-white text-center flex justify-center items-center flex-col mb-20 mx-auto gap-6">
                <Image src={TokenLogo} width={200} height={164} alt=""/>
                <div className="">
                  <h2 className="text-white font-semibold text-md">
                    You don’t have any positions yet
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Once you stake LP tokens, your farming positions will appear
                    here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {openFarmModal && <FarmDeposit setOpenState={setOpenFarmModal}/>}
        <MobileNav />
        <DappFooter />
      </div>
    </>
  );
};

export default FarmPage;
