import { Popover, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface CrPopoverProps {
  btnText: string;
  children: ReactNode;
}

export default function CrPopover({ btnText, children }: CrPopoverProps) {
  return (
    <div>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${
                  open ? "" : "text-opacity-90"
                } outline-none hover:text-cr-green`}
            >
              <span>{btnText}</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute mt-3 z-10 w-full right-1/2 -translate-x-1/2 transform">
                <div className="font-bold bg-cr-modal flex flex-col p-5 rounded-lg w-screen max-w-[199px]  md:max-w-xl">
                  {children}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
