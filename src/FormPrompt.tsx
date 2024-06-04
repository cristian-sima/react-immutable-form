/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getWords } from "./words";

/**
 * Created a FormPromter component, given a history value
 *
 * @param {*} history The History value from react-router
 * @returns {JSX.Element | null} The FormPrompt component.
 */
export const createFormPromter = (history : any) => {
  const
    useBlocker = (blocker : any, when = true) => {
      React.useEffect(() => {
        if (!when) {
          return () => {};
        }

        const unblock = history.block((tx : any) => {
          const autoUnblockingTx = {
            ...tx,
            retry() {
              unblock();
              tx.retry();
            },
          };

          blocker(autoUnblockingTx);
        });

        return unblock;
      }, [blocker, when]);
    },

    useCallbackPrompt = (when : boolean) => {
      const navigate = useNavigate(),
        location = useLocation(),
        [showPrompt, setShowPrompt] = useState(false),
        [lastLocation, setLastLocation] = useState<any>(null),
        [confirmedNavigation, setConfirmedNavigation] = useState(false),
        cancelNavigation = useCallback(() => {
          setShowPrompt(false);
        }, []),

        handleBlockedNavigation = useCallback(
          (nextLocation) => {
            const 
              locationChanged = nextLocation.location.pathname !== location.pathname,
              didNotConfirmed = !confirmedNavigation,
              shouldPrompt = locationChanged && didNotConfirmed;

            if (shouldPrompt) {
              setShowPrompt(true);
              setLastLocation(nextLocation);
              return false;
            }

            return true;
          },
          [confirmedNavigation],
        ),

        confirmNavigation = useCallback(() => {
          setShowPrompt(false);
          setConfirmedNavigation(true);
        }, []);

      useEffect(() => {
        if (confirmedNavigation && lastLocation) {
          navigate(lastLocation.location.pathname);
        }
      }, [confirmedNavigation, lastLocation]);
      useBlocker(handleBlockedNavigation, when);
      return [showPrompt, confirmNavigation, cancelNavigation];
    },
    /**
   * FormPrompt component.
   * 
   * This component monitors whether a form has unsaved changes and, if the user attempts to navigate away
   * from the form, it displays a confirmation prompt asking if they are sure they want to leave without saving.
   * 
   * @param {Object} props - Component properties.
   * @param {boolean} props.dirty - Indicates whether the form has unsaved changes.
   * 
   * @returns {JSX.Element | null} The FormPrompt component.
   */
    FormPrompt = (props : { readonly dirty : boolean }) => {
      const
        [showPrompt, confirmNavigation, cancelNavigation] =  useCallbackPrompt(props.dirty),
        [ showConfirm, setShowConfirm ] = React.useState(false);

      React.useEffect(() => {
        if (showPrompt && !showConfirm) {
          setShowConfirm(true);
          if (confirm(getWords().CONFIRMATION_FORM_LEAVE)) {    
            if (typeof confirmNavigation === "function") {
              confirmNavigation();
            }
          } else if (typeof cancelNavigation === "function") {
            setTimeout(() => {
              cancelNavigation();
              setShowConfirm(false);
              // eslint-disable-next-line no-magic-numbers
            }, 100);
          }
        }
      }, [showConfirm, showPrompt]);

      return (
        null
      );
    };

  return FormPrompt;
};