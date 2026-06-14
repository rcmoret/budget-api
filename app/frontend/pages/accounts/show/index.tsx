import { MainComponent, pageHeadingClassName } from "@frontend/layout";

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b border-base-200">
      <h1 className={pageHeadingClassName}>Account Txns</h1>
    </div>
  );
};

// const TransactionShowContent = () => {
//   const { isOdd } = useTransactionContext();

//   const bgColor = isOdd ? "bg-sky-100" : "bg-sky-50";

//   const outerClassName = [
//     "grid",
//     "grid-cols-[minmax(125px,auto)_minmax(200px,auto)_minmax(125px,auto)_minmax(125px,auto)_1fr]",
//     "gap-x-4",
//   ].join(" ");

//   const subgridClassName = [ "col-span-5", "grid",
//     "grid-cols-subgrid",
//     "items-start",
//     "px-4",
//     "py-2",
//     bgColor,
//   ].join(" ");

//   return (
//     <div>
//       <div className={outerClassName}>
//         <div className={subgridClassName}>
//           <ClearanceDateComponent />
//           <DescriptionComponent />
//           <div className="flex flex-col items-end">
//             <TransactionAmountComponent />
//           </div>
//           <BalanceComponent />
//           <div className="flex justify-between items-end px-2">
//             <EntryDetailsComponent />
//             <EntryActionsComponent />
//           </div>
//         </div>
//       </div>
//       <div className={`w-full p-4 ${bgColor}`}>
//         <ReceiptDisplayComponent />
//       </div>
//     </div>
//   );
// };

const AccountTransactionsIndex = (props: any) => {
  return (
    <MainComponent namespace="accounts" header={<Header />} rightColumn={null}>
      Foo bar
    </MainComponent>
  );
};

export default AccountTransactionsIndex;
