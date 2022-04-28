import { creatPortal } from "react-dom"; // TODO: If it's not being used, get rid of it
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import VNFTCard from "./VNFTCard";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import clsx from "clsx";

const Modal = ({
    isShowing,
    hide,
    createSwap,
    approveNft,
    approvedNft,
    approved,
    address,
    txLoad, // TODO: If it's not being used, get rid of it
    swapId,
    initialized
}) => {
    const [selected, setSelected] = React.useState([false, false, false]); // TODO: If it's not being used, get rid of it
    const [loading, setLoading] = React.useState(false);
    const [nfts, setNfts] = useState([]);

    console.log(address);

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(
                    `https://eth-rinkeby.alchemyapi.io/v2/demo/getNFTs/nBdRx9b77E3p9TU4Vte09EYfuUGisD1Z?owner=${address}` // TODO: Where is a better place to store this? Why is this so ugly?
                );

                console.log(result); // TODO: Do we need to see something?

                if (result?.data?.ownedNfts?.length > 0) { // TODO: What do all these question marks mean?
                    setNfts(result?.data?.ownedNfts.splice(0, 3));
                    console.log(nfts);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [address]); // TODO: Do I need to add nfts here?

    return isShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div
                      className="w-screen h-screen bg-white bg-opacity-[0.4] backdrop-blur-[3px] z-10 top-0 left-0 fixed" // TODO: How does all these stuff work?
                      data-aos="fade-in"
                  >
                      <div className="w-1/3 h-full flex items-center mx-auto">
                          <div
                              className={clsx(
                                  "p-4 rounded-xl bg-swapify-gray w-full"
                              )}
                          >
                              <div className="flex flex-row items-center justify-between">
                                  <h1 className="text-3xl pb-4">
                                      Choose NFT (S)
                                  </h1>
                                  <button
                                      type="button"
                                      className="text-3xl"
                                      data-dismiss="modal"
                                      aria-label="Close"
                                      onClick={hide}
                                  >
                                      <span aria-hidden="true">&times;</span>
                                  </button>
                              </div>
                              <Formik
                                  initialValues={{
                                      nfts: selected,
                                      description: "",
                                  }}
                                  onSubmit={(values, { setSubmitting }) => {
                                      setTimeout(() => {
                                          if (swapId) {
                                              createSwap(swapId);
                                          } else {
                                              createSwap(values.description);
                                          }
                                          setSubmitting(false);
                                          hide();
                                      }, 400);
                                  }}
                              >
                                  {({ isSubmitting }) => (
                                      <Form className="flex flex-col gap-y-6">
                                          <div className="flex flex-row gap-x-3 mx-auto items-center">
                                              {nfts.map((nft, index) => (
                                                  <VNFTCard
                                                      key={index}
                                                      active={
                                                          approvedNft?.tokenId ==
                                                          nft?.id?.tokenId
                                                              ? true
                                                              : false
                                                      }
                                                      name={nft?.metadata?.name}
                                                      onApprove={async () => {
                                                          setLoading(true);
                                                          approveNft(
                                                              nft?.contract
                                                                  ?.address,
                                                              nft?.id?.tokenId
                                                          );
                                                          setLoading(false);
                                                      }}
                                                      image={
                                                          nft?.metadata?.image
                                                      }
                                                  />
                                              ))}
                                          </div>
                                          {initialized && (
                                              <>
                                                  <label>Description</label>
                                                  <Field
                                                      type="text"
                                                      className="pl-1 mr-6 mb-4 rounded py-1 text-black"
                                                      name="description"
                                                      placeholder="I am looking for..."
                                                  />
                                              </>
                                          )}
                                          {approved && (
                                              <div className="w-full">
                                                  <button
                                                      type="submit"
                                                      className="rounded-lg bg-gray-500 hover:bg-gray-300 px-3 py-1"
                                                  >
                                                      Put up for swap
                                                  </button>
                                              </div>
                                          )}
                                      </Form>
                                  )}
                              </Formik>
                          </div>
                      </div>
                  </div>
              </React.Fragment>,
              document.body
          )
        : null; // TODO: Fix the formatting
};

export default Modal;
