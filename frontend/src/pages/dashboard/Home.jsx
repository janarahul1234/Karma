import { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Target,
  Wallet,
  ChartPie,
  PiggyBank,
  LoaderCircle,
} from "lucide-react";

import useAuthStore from "@/stores/authStore";
import useGoalStore from "@/stores/goalStore";
import useTransactionStore from "@/stores/transactionStore";

import { cn } from "@/lib/utils";

import { GoalStatus, TransactionTypes } from "@/constants";

import {
  getDayPeriod,
  getPersonalizedMessage,
  formatAmount,
} from "@/utils/helper";

import {
  SectionHeader,
  SectionHeaderContainer,
  SectionHeaderTitle,
  SectionHeaderDescription,
} from "@/components/partials/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GoalCard = lazy(() => import("@/components/goal/GoalCard"));
const FallbackCards = lazy(() => import("@/components/partials/FallbackCards"));

const Home = () => {
  const { user } = useAuthStore();
  const { goals, fetchGoals } = useGoalStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  function gotoGoalsPage() {
    navigate("/goals");
  }

  async function fetchData() {
    try {
      await fetchGoals();
      await fetchTransactions();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const firstName = user?.fullName?.split(" ")[0];

  const activeGoals = goals.filter((g) => g.status === GoalStatus.ACTIVE);
  const activeGoalsCount = activeGoals.length;

  const totalIncome = transactions
    .filter((t) => t.type === TransactionTypes.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TransactionTypes.EXPENSE || t.type === "saving")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const totalSaved = activeGoals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress =
    totalAmount > 0 ? (totalSaved / totalAmount) * 100 : 0;

  return (
    <>
      <SectionHeader>
        <SectionHeaderContainer>
          <SectionHeaderTitle>
            Good {getDayPeriod()}, {firstName || "there"} 👋
          </SectionHeaderTitle>
          <SectionHeaderDescription>
            {getPersonalizedMessage(goals, netIncome)}
          </SectionHeaderDescription>
        </SectionHeaderContainer>
        <Button size="lg" onClick={gotoGoalsPage}>
          <Plus /> Add Goal
        </Button>
      </SectionHeader>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Active goals */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <Target size={32} className="flex-shrink-0 text-purple-500" />
            <div>
              <p className="text-muted-foreground text-sm">Active Goals</p>
              <p className="text-2xl font-semibold">{activeGoalsCount}</p>
            </div>
          </CardContent>
        </Card>

        {/* Net income */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <Wallet size={32} className="flex-shrink-0 text-green-500" />
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

        {/* Total saved */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <PiggyBank size={32} className="flex-shrink-0 text-blue-500" />
            <div>
              <p className="text-muted-foreground text-sm">Total Saved</p>
              <p className="text-2xl font-semibold">
                {formatAmount(totalSaved)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Overall progress */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <ChartPie size={32} className="flex-shrink-0 text-orange-500" />
            <div>
              <p className="text-muted-foreground text-sm">Overall Progress</p>
              <p className="text-2xl font-semibold">
                {overallProgress?.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      {isLoading ? (
        <div className="p-12 grid place-items-center">
          <LoaderCircle className="text-primary animate-spin size-8" />
        </div>
      ) : activeGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeGoals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      ) : (
        <FallbackCards
          icon={Target}
          title="No savings goals yet"
          description="Start by adding your first product goal to begin tracking your savings."
          action={
            <Button size="lg" onClick={gotoGoalsPage}>
              <Plus /> Add Your First Goal
            </Button>
          }
        />
      )}
    </>
  );
};

export default Home;
