"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import {
  Close,
  DepositSuccess,
  EthLogo,
  LoadingImg,
  UsdcBgLogo,
  Wallet,
} from "../assets";
import React, { useEffect, useState } from "react";
import UseStore from "@/store/UseStore";
import {
  BASE_FEE,
  accountToScVal,
  getEstimatedFee,
  getServer,
  getTxBuilder,
  mintTokens,
  simulateTx,
  submitTx,
} from "@/app/helpers/soroban";
import { TESTNET_DETAILS, signTx } from "@/app/helpers/network";
import { ethers } from "ethers";
import { stroopToXlm, xlmToStroop } from "@/app/helpers/format";
import { kit } from "../navigations/dAppHeader";
import { ERRORS } from "@/app/helpers/error";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import { ActivateQuote } from "@/app/dataService/dataServices";
const FarmDeposit: React.FC<{ setOpenState: any }> = ({ setOpenState }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("");
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
    selectedNetwork,
  } = UseStore();
  const provider = getServer(selectedNetwork);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fee, setFee] = React.useState(BASE_FEE);
  const [step, setStep] = useState(0);
  const [isGettingFee, setIsGettingFee] = useState<Boolean | null>(null);
  const contractAddress = selectedPool.contractAddress;
  const [connectionError, setConnectionError] = useState(null as string | null);
  const [openXDR, setOpenXDR] = useState(false);
  const [signedXdr, setSignedXdr] = React.useState("");
  const [txResultXDR, setTxResultXDR] = useState<String | null>(null);
  const [notEnoughBal, setNotEnoughBal] = useState(false);
  const [initialQuote, setInitialQuote] = useState<number | null | string>("0");
  const [quote, setQuote] = useState<number | null | string>("0");
  const [minAmountAlert, setMinAmountAlert] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<boolean | null>(null);
  const [isProductExpired, setIsProductExpired] = useState(false);
  const [quoteActivated, setQuoteActivated] = useState(false);
  const [quoteActivationLoading, setQuoteActivationLoading] = useState(true);
  const [quoteProcessAlert, setQuoteProcessAlert] = useState("");
  const [depositEnabled, setDepositEnabled] = useState(true);
  const [quoteFromSc, setQuoteFromSC] = useState("");
  const maturity = selectedPool?.maturityTimeStamp;
  // after depoist input proceed to the next
  const getFee = async () => {
    setIsGettingFee(true);

    try {
      const builder = await getTxBuilder(
        connectorWalletAddress!,
        fee,
        provider,
        selectedNetwork.networkPassphrase
      );

      const estimatedFee = await getEstimatedFee(
        contractAddress,
        ethers
          .parseUnits(depositAmount, selectedPool?.tokenDecimals)
          .toString(),
        connectorWalletAddress!,
        memo,
        builder,
        provider
      );
      setFee(stroopToXlm(estimatedFee).toString());
      setIsGettingFee(false);
    } catch (error: any) {
      setConnectionError("error getting fee");
      // defaults to hardcoded base fee if this fails
      console.log(error);
      if (error.includes("HostError: Error(Contract, #4)")) {
        setIsProductExpired(true);
      } else {
        setIsProductExpired(false);
      }
      setIsGettingFee(false);
    }
  };
  console.log({ isProductExpired, depositEnabled });
  const signWithFreighter = async () => {
    setIsSubmitting(true);

    const txBuilderAdmin = await getTxBuilder(
      connectorWalletAddress,
      xlmToStroop(fee).toString(),
      provider,
      selectedNetwork.networkPassphrase
    );
    const xdr = await mintTokens({
      tokenId: contractAddress,
      quantity: ethers
        .parseUnits(depositAmount, selectedPool?.tokenDecimals)
        .toString(),
      destinationPubKey: connectorWalletAddress,
      memo,
      txBuilderAdmin,
      server: provider,
    });

    try {
      // Signs XDR representing the "mint" transaction
      const signedTx = await signTx(xdr, connectorWalletAddress, kit);
      setIsSubmitting(false);
      setSignedXdr(signedTx);
    } catch (e) {
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SIGN_TX);
    }
  };

  //Finally submit Deposit transaction
  const submit = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitTx(
        signedXdr,
        selectedNetwork.networkPassphrase,
        provider
      );

      setTxResultXDR(result);
      setTransactionsStatus({ deposit: true });
      setIsSubmitting(false);
      setStep(2);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
    }
  };

  const getQuoteCont = async (
    id: string,
    txBuilder: TransactionBuilder,
    connection: any,
    destinationPubKey: string | null = null
  ) => {
    const contract = new Contract(id);
    if (!destinationPubKey) {
      return false;
    }
    const tx = txBuilder
      .addOperation(contract.call("quote"))
      .setTimeout(30)
      .build();

    const result = await simulateTx<string>(tx, connection);
    return ethers.formatUnits(result, selectedPool.shareDecimals);
  };
  const getQuote = async () => {
    setQuoteActivationLoading(true);
    const txBuilderBalance = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );
    // setQuoteProcessAlert("Checking Quote...")
    const quote: any = await getQuoteCont(
      selectedPool.contractAddress,
      txBuilderBalance,
      provider,
      connectorWalletAddress
    );
    setQuoteActivationLoading(Number(quote) > 0 ? false : true);
    setQuoteProcessAlert(
      Number(quote) > 0 ? "Quote successful." : "No Quote, Requesting Quote."
    );
    setQuoteFromSC(quote);
    return quote;
  };

  const calEstimatedBonds = () => {
    const estimatedBond = Number(initialQuote) * Number(depositAmount);
    return estimatedBond;
  };

//   useEffect(() => {
//     if (signedXdr) {
//       submit();
//     }
//   }, [signedXdr]);

  // useEffect(() => {
  //   if (isGettingFee === false && connectionError !== "error getting fee") {
  //     setStep(1);
  //     setIsGettingFee(null)
  //   }
  // }, [isGettingFee, connectionError]);

//   useEffect(() => {
//     if (Number(depositAmount) > Number(userBalance)) {
//       setNotEnoughBal(true);
//     } else {
//       setNotEnoughBal(false);
//     }

//     if (
//       Number(depositAmount) != 0 &&
//       Number(depositAmount) < Number(selectedPool.minimum)
//     ) {
//       setMinAmountAlert(true);
//     } else {
//       setMinAmountAlert(false);
//     }
//   }, [depositAmount, userBalance]);

  // useEffect(() => {
  //   // console.log("quoteImmediately")
  //   getQuote()
  // }, [])
  // console.log({quoteActivated, quoteStatus, quote})
//   useEffect(() => {
//     if (Number(quoteFromSc) <= 0) {
//       const timer = setTimeout(() => {
//         getQuote();
//         setQuoteActivationLoading(false);
//         setQuoteActivated(false);
//         // console.log({ "getting quote after activation": quote });
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [quoteActivated, quoteActivationLoading, step, initialQuote]);

  const activate = async () => {
    setQuoteProcessAlert("Requesting Quote...");
    try {
      const { data, isLoading } = await ActivateQuote(contractAddress);
      console.log({ initialQuote: data });
      if (data) {
        setInitialQuote(
          ethers.formatUnits(data?.quote, selectedPool.shareDecimals)
        );
        setQuoteActivated(true);
        setQuoteProcessAlert("Requesting Quote...");
      }
      // console.log("quotebefore")
    } catch (error) {
      setQuoteActivated(false);
      setQuoteActivationLoading(false);
    }
  };
  console.log({ quoteFromSc });
//   useEffect(() => {
//     setQuoteActivationLoading(true);

//     // if(quoteStatus === false){
//     activate();
//     // }
//     // }, [quoteStatus,quoteActivated, quoteActivationLoading, step])
//   }, []);

  const maxDeposit = () => {
    setDepositAmount(userBalance);
  };
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const validateInput = (value: number) => {
    if (selectedPool.ticker == "BTC") {
      if (value < 100 || value % 100 !== 0) {
        return "Deposit amount must be a multiple of 100.";
      }
    } else if (selectedPool.ticker == "ETH") {
      if (value < 10 || value % 10 !== 0) {
        return "Deposit amount must be a multiple of 10.";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepositAmount(value);

    const numericValue = Number(value);
    if (value) {
      const validationError: string | undefined = validateInput(numericValue);
      setErrorMessage(validationError);
    } else {
      setErrorMessage("");
    }
  };

  const moveToDeposit = () => {
    // if(!isGettingFee) {
    // getFee()
    signWithFreighter();
    setStep(1);
    // }
  };
  return (
    <>
      <div
        className={`fixed modal-container z-[999] w-full md:p-4 top-0 left-0 h-full flex items-center max-sm:items-end justify-center ${styles.modal}`}
      >
        <div className=" w-full mx-auto flex items-center justify-center ">
          {step === 0 && (
            <div className="modal_content relative w-[500px] max-sm:w-full pb-5  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-28">
              <div className="header flex justify-between items-start">
                <div className="mb-6">
                  <h1 className="text-lg">Farm LP tokens</h1>
                  <p className="text_grey text-sm">BOND/USDT</p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenState(false)}
                >
                  <Image
                    src={Close}
                    width={18}
                    height={18}
                    alt="right"
                    className=""
                  />
                </div>
              </div>

              <div className="md:p-3 py-3">
                <p className="text-white mb-3 text-sm">Farm Amount</p>

                <div className=" flex justify-between items-center mb-4 card md:py-1 py-2 max-md:px-2">
                  <div className="relative">
                    <input
                      type="tel"
                      id="success"
                      className="bg-transparent md:pl-5 pl-2 outline-none rounded-r-lg text-blueish  block md:text-[20px] text-[16px] text-left max-w-[250px]"
                      placeholder="0"
                      name="depositAmount"
                      value={depositAmount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" flex items-center gap-1 md:px-3 md:py-2">
                    <h1 className="md:text-md text-sm text_grey">BOND/USDT LP</h1>
                  </div>
                </div>

                <div className="balance flex justify-between">
                  <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-1 ">
                      <p className="text-sm text_grey">Available :</p>
                      <h2 className="text-md text-blueish">0.198685</h2>
                    </div>
                    <span
                      className="text-sm rounded shadowBackDrop px-3 py-[2px]"
                      onClick={maxDeposit}
                    >
                      max
                    </span>
                  </div>

                  <h2 className="text-md max-sm:text-sm cursor-pointer text-blueish">
                    Get More
                  </h2>
                </div>

                <div className="pt-4 mt-6">
                  <div className=" flex items-center justify-between mb-3">
                    <p className="text_grey text-md max-sm:text-sm">My Farm</p>
                    <p className="text-white text-md max-sm:text-sm">$34 854</p>
                  </div>
                  <div className=" flex items-center justify-between mb-1 mb-3">
                    <p className="text_grey text-md max-sm:text-sm">USDT</p>
                    <p className="text-white text-md max-sm:text-sm">17 398.2271</p>
                  </div>
                  <div className=" flex items-center justify-between mb-1 mb-3">
                    <p className="text_grey text-md max-sm:text-sm">BOND</p>
                    <p className="text-white text-md max-sm:text-sm">2 632.345</p>
                  </div>
                </div>
                <div className="border-t border-gray-500 pt-4 mt-6">
                  <div className=" flex items-center justify-between mb-1">
                    <p className="text_grey text-md max-sm:text-sm">Farm APR</p>
                    <p className="text-gold text-md max-sm:text-sm">36.99%</p>
                  </div>
                  <div className=" flex items-center justify-between mb-1 mb-4">
                    <p className="text_grey text-md max-sm:text-sm">Blockchain Fee</p>
                    <p className="text-white text-md max-sm:text-sm">0.14 - 0.8 BOND</p>
                  </div>
                </div>
              </div>
              <button
                className={`mt-7 py-3 w-full flex ${"proceed"}`}
                onClick={moveToDeposit}
              >
                {/* {isGettingFee ? (
                    <div className="mx-auto">
                      <Loading />
                    </div>
                  ) : ( */}
                <p className="mx-auto">Farm</p>
                {/* )} */}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[150px] max-sm:pb-36 max-sm:pt-28">
              <div className="header flex justify-between items-start absolute top-5 right-5">
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenState(false)}
                >
                  <Image
                    src={Close}
                    width={18}
                    height={18}
                    alt="right"
                    className=""
                  />
                </div>
              </div>
              <Image src={LoadingImg} width={93} height={93} alt="loading" />
              <h1 className="text-2xl px-16 mb-7">
                Confirm transaction in your wallet
              </h1>
              <p className="text_grey text-sm">Farm 0.1998783 BOND/USDT LP</p>
            </div>
          )}
          {step === 2 && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[150px] max-sm:pb-36 max-sm:pt-28">
            <div className="header flex justify-between items-start absolute top-5 right-5">
              <div
                className="cursor-pointer"
                onClick={() => setOpenState(false)}
              >
                <Image
                  src={Close}
                  width={18}
                  height={18}
                  alt="right"
                  className=""
                />
              </div>
            </div>
            <Image src={LoadingImg} width={93} height={93} alt="loading" />
            <h1 className="text-2xl px-16">
            One more second
            </h1>
            <p className="text_grey text-sm">Farm 0.1998783 BOND/USDT LP</p>
          </div>
          )}
                    {step === 3 && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[70px] max-sm:pb-36 max-sm:pt-28">
            <div className="header flex justify-between items-start absolute top-5 right-5">
              <div
                className="cursor-pointer"
                onClick={() => setOpenState(false)}
              >
                <Image
                  src={Close}
                  width={18}
                  height={18}
                  alt="right"
                  className=""
                />
              </div>
            </div>
            <Image src={LoadingImg} width={93} height={93} alt="loading" />
            <h1 className="text-2xl px-16">
            Your transaction was successful
            </h1>
            <p className="text_grey text-sm mb-5">Farm 0.1998783 BOND/USDT LP</p>
            <p className="text-blueish text-sm">View on explorer</p>

            <button
                className={`mt-7 py-3 w-6/12 flex ${"proceed"}`}
                onClick={() => setOpenState(false)}
              >
                {/* {isGettingFee ? (
                    <div className="mx-auto">
                      <Loading />
                    </div>
                  ) : ( */}
                <p className="mx-auto">Got It</p>
                {/* )} */}
              </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmDeposit;
