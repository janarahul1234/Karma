import { lazy, useState, useEffect } from "react";
import {
  Plus,
  Search,
  ListFilter,
  ArrowDownUp,
  LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import useGoalStore from "@/stores/goalStore";

import { debounce, toCapitalize } from "@/utils/helper";

import {
  AvailableGoalCategories,
  GoalSortTypes,
  AvailableGoalSortTypes,
} from "@/constants";

import {
  SectionHeader,
  SectionHeaderContainer,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@/components/partials/SectionHeader";
import GoalFormDialog from "@/components/goal/GoalFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GoalCard = lazy(() => import("@/components/goal/GoalCard"));
const FallbackCards = lazy(() => import("@/components/partials/FallbackCards"));

const Goals = () => {
  const { goals, isLoading, fetchGoals } = useGoalStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [params, setParams] = useState({
    search: "",
    category: "all",
    sort: GoalSortTypes.NAME,
  });

  function handleAddGoalDialog() {
    setIsAddDialogOpen(true);
  }

  const handleSearch = debounce((e) => {
    setParams((prev) => ({ ...prev, search: e.target.value }));
  }, 500);

  function handleCategory(value) {
    setParams((prev) => ({ ...prev, category: value }));
  }

  function handleSort(value) {
    setParams((prev) => ({ ...prev, sort: value }));
  }

  useEffect(() => {
    try {
      fetchGoals(params);
    } catch (error) {
      toast.error("Fetch goals failed, Please try again.");
    }
  }, [params]);

  return (
    <>
      <SectionHeader>
        <SectionHeaderContainer>
          <SectionHeaderTitle>Savings Goals</SectionHeaderTitle>
          <SectionHeaderDescription>
            Manage your product savings goals
          </SectionHeaderDescription>
        </SectionHeaderContainer>
        <Button size="lg" onClick={handleAddGoalDialog}>
          <Plus /> Add Goal
        </Button>
      </SectionHeader>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-8">
        {/* Search box */}
        <div className="relative w-full sm:max-w-xs">
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
            <Search size={20} aria-hidden="true" />
          </div>
          <Input
            type="text"
            placeholder="Search goals..."
            variant="lg"
            className="ps-12"
            onInput={handleSearch}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={params.category} onValueChange={handleCategory}>
            <SelectTrigger size="lg" className="w-full sm:w-[180px]">
              <div className="flex gap-3">
                <ListFilter size={20} className="text-muted-foreground/80" />
                <SelectValue placeholder="Select a category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {AvailableGoalCategories.map((value) => (
                <SelectItem key={value} value={value}>
                  {toCapitalize(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={params.sort} onValueChange={handleSort}>
            <SelectTrigger size="lg" className="w-full sm:w-[180px]">
              <div className="flex gap-3">
                <ArrowDownUp size={20} className="text-muted-foreground/80" />
                <SelectValue placeholder="Select a sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {AvailableGoalSortTypes.map((value) => (
                <SelectItem key={value} value={value}>
                  {toCapitalize(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Goals */}
      {isLoading ? (
        <div className="p-12 grid place-items-center">
          <LoaderCircle className="text-primary animate-spin size-8" />
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} />
          ))}
        </div>
      ) : (
        <FallbackCards
          icon={Plus}
          title="No savings goals yet"
          description="Start by adding your first product goal."
        />
      )}

      {/* Dialog */}
      <GoalFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
};

export default Goals;
