<template>
  <div class="space-y-5">
    <div class="grid gap-5 lg:grid-cols-3">
      <TechnicianPerformanceCard />
      <TeamProductivityCard />
      <ManagerStatusCard />
    </div>

    <div class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <CollaboratorPerformanceCard />
      <GoalConfigurationCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import CollaboratorPerformanceCard from './CollaboratorPerformanceCard.vue';
import GoalConfigurationCard from './GoalConfigurationCard.vue';
import ManagerStatusCard from './ManagerStatusCard.vue';
import TeamProductivityCard from './TeamProductivityCard.vue';
import TechnicianPerformanceCard from './TechnicianPerformanceCard.vue';
</script>
