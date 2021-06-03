import { convertNumber } from '../../utils/convertNumber';

const textConfig = {
  contributionCard: {
    next: ' until next milestone:',
    final: ' to accomplish the mission',
    accomplished: 'Mission Accomplished!',
  },
  missionCard: {
    next: 'to',
    final: 'to complete',
    accomplished: 'Mission Accomplished!',
  },
};
export const useMilestoneProgressHook = (
  milestones,
  type = 'contributionCard',
) => {
  let currentMilestone = null;
  let currentMilestoneIndex = null;
  let nextMilestone = '';
  let milestoneText = '';
  let pendingAmount = 0;
  let progressPercentage = 1;
  currentMilestone = milestones.find(
    (milestone) => milestone.achieved === false,
  );
  if (currentMilestone) {
    currentMilestoneIndex = milestones.findIndex(
      (milestone) => milestone.achieved === false,
    );

    pendingAmount =
      +currentMilestone.amount -
      (+currentMilestone.percentage_completed / 100) * +currentMilestone.amount;

    progressPercentage = +currentMilestone.percentage_completed / 100;

    if (
      currentMilestoneIndex !== milestones.length - 1 &&
      !milestones[currentMilestoneIndex + 1].achieved
    ) {
      nextMilestone = milestones[currentMilestoneIndex + 1].title;
      milestoneText = textConfig[type].next;
    } else {
      milestoneText = textConfig[type].final;
    }
  } else {
    milestoneText = textConfig[type].accomplished;
    pendingAmount = 0;
  }
  if (pendingAmount) {
    pendingAmount = `${convertNumber(pendingAmount ? +pendingAmount : 0)}`;
  }

  return {
    currentMilestone,
    nextMilestone,
    pendingAmount,
    milestoneText,
    progressPercentage,
  };
};
