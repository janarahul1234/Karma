import { lazy, useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowDownUp,
  LoaderCircle,
} from "lucide-react";

import useTransactionStore from "@/stores/transactionStore";

import { formatAmount, toCapitalize } from "@/utils/helper";
import { cn } from "@/lib/utils";

import {
  TransactionTypes,
  AvailableTransactionTypes,
  TransactionSortTypes,
} from "@/constants";

import {
  SectionHeader,
  SectionHeaderContainer,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@/components/partials/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const TransactionCard = lazy(() =>
  import("@/components/transaction/TransactionCard")
);
const FallbackCards = lazy(() => import("@/components/partials/FallbackCards"));
const AddTransactionDialog = lazy(() =>
  import("@/components/transaction/AddTransactionDialog")
);

const Finances = () => {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [params, setParams] = useState({
    type: "all",
    sort: TransactionSortTypes.DATE,
  });

  function handleAddFinanceDialog() {
    setAddTransactionOpen(true);
  }

  function handleTabs(value) {
    return () => setParams((prev) => ({ ...prev, type: value }));
  }

  function handleSort(value) {
    setParams((prev) => ({ ...prev, sort: value }));
  }

  useEffect(() => {
    fetchTransactions(params);
  }, [params]);

  const totalIncome = transactions
    .filter((t) => t.type === TransactionTypes.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TransactionTypes.EXPENSE || t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <>
      <SectionHeader>
        <SectionHeaderContainer>
          <SectionHeaderTitle>Income & Expenses</SectionHeaderTitle>
          <SectionHeaderDescription>
            Track your financial transactions
          </SectionHeaderDescription>
        </SectionHeaderContainer>
        <Button size="lg" onClick={handleAddFinanceDialog}>
          <Plus /> Add Transaction
        </Button>
      </SectionHeader>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Total income */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <TrendingUp size={32} className="flex-shrink-0 text-green-500" />
            <div>
              <p className="text-muted-foreground text-sm">Total Income</p>
              <p className="text-green-500 text-2xl font-semibold">
                {formatAmount(totalIncome)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total expense */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <TrendingDown
              size={32}
              className="flex-shrink-0 text-destructive"
            />
            <div>
              <p className="text-muted-foreground text-sm">Total Expense</p>
              <p className="text-destructive text-2xl font-semibold">
                {formatAmount(totalExpenses)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Net income */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <Calendar size={32} className="flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-muted-foreground text-sm">Net Income</p>
              <p
                className={cn(
                  netIncome < 0 ? "text-destructive" : "",
                  "text-2xl font-semibold"
                )}
              >
                {formatAmount(netIncome)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
        <Tabs defaultValue={params.type} className="w-full sm:w-[350px]">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger
              value="all"
              className="data-[state=active]:text-primary"
              onClick={handleTabs("all")}
            >
              All
            </TabsTrigger>
            {AvailableTransactionTypes.map((value) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:text-primary"
                onClick={handleTabs(value)}
              >
                {toCapitalize(value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Select defaultValue={params.sort} onValueChange={handleSort}>
          <SelectTrigger size="lg" className="w-full sm:w-[160px]">
            <div className="flex gap-3">
              <div className="text-muted-foreground/80">
                <ArrowDownUp size={20} aria-hidden="true" />
              </div>
              <SelectValue placeholder="Select a sort" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions */}
      {isLoading ? (
        <div className="p-12 grid place-items-center">
          <LoaderCircle className="text-primary animate-spin size-8" />
        </div>
      ) : transactions.length > 0 ? (
        <div className="grid gap-2">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction._id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <FallbackCards
          icon={TrendingUp}
          title="No transactions yet"
          description="Start by adding your first income or expense transaction."
          action={
            <Button size="lg" onClick={handleAddFinanceDialog}>
              <Plus /> Add Your First Transaction
            </Button>
          }
        />
      )}

      {/* Dialog */}
      <AddTransactionDialog
        open={addTransactionOpen}
        onOpenChange={setAddTransactionOpen}
      />
    </>
  );
};

export default Finances;
