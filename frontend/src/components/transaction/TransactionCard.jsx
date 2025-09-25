import { lazy, useState } from "react";
import { TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { format } from "date-fns";

import useTransactionStore from "@/stores/transactionStore";

import { toCapitalize, formatAmount } from "@/utils/helper";
import { cn } from "@/lib/utils";

import { TransactionTypes } from "@/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DeleteTransactionDialog = lazy(() =>
  import("@/components/transaction/DeleteTransactionDialog")
);

export default function TransactionCard({ transaction = {} }) {
  const { _id, type, category, amount, date, description } = transaction;

  const { deleteTransaction } = useTransactionStore();
  const [deleteTransactionOpen, setDeleteTransactionOpen] = useState(false);

  function handleDeleteTransactionDialog() {
    setDeleteTransactionOpen(true);
  }

  function handleDeleteTransaction() {
    deleteTransaction(_id);
    setDeleteTransactionOpen(false);
  }

  const isSaving = type === "saving";
  const isIncome = type === TransactionTypes.INCOME;

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between gap-5">
          <div
            className={cn(
              "size-11 bg-primary/10 grid place-items-center rounded-full",
              isIncome
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isIncome ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div className="grow flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {description ? description : toCapitalize(category)}
              </p>
              <p className="text-muted-foreground text-sm">
                {toCapitalize(category)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-xl font-semibold",
                  isIncome ? "text-primary" : "text-destructive"
                )}
              >
                {isIncome ? "+" : "-"}
                {formatAmount(amount)}
              </p>
              <p className="text-muted-foreground text-sm">
                {format(date, "d MMM, yyyy")}
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive p-5"
            onClick={handleDeleteTransactionDialog}
            disabled={isSaving}
          >
            <Trash2 className="size-5 opacity-100" />
          </Button>
        </CardContent>
      </Card>

      {/* Dialog */}
      <DeleteTransactionDialog
        open={deleteTransactionOpen}
        onOpenChange={setDeleteTransactionOpen}
        transaction={transaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </>
  );
}
