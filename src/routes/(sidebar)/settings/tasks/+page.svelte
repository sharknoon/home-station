<script lang="ts">
    import type { PageData } from './$types';
    import { intlFormatDistance } from 'date-fns';
    import { i18n } from '$lib/i18n';
    import Play from 'lucide-svelte/icons/play';
    import cronstrue from 'cronstrue';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import type { TaskStats } from '$lib/server/tasks';

    export let data: PageData;

    onMount(() => {
        const evtSource = new EventSource('/settings/tasks/events');
        evtSource.onerror = (e) => console.error(e);
        evtSource.addEventListener('updateStats', (stats: MessageEvent<string>) => {
            const updatedStats = JSON.parse(stats.data) as {
                id: string;
                stats: TaskStats;
            };
            data.tasks = data.tasks.map((task) => {
                if (task.id === updatedStats.id) {
                    task.stats = updatedStats.stats;
                }
                return task;
            });
        });
    });

    setInterval(() => {
        data.tasks = data.tasks;
    }, 1000);
</script>

<h2 class="h2 mb-4">{$i18n.t('settings.tasks.scheduled-tasks')}</h2>

<div class="table-container">
    <table class="table table-hover [&_td]:!align-middle">
        <thead>
            <tr>
                <th>{$i18n.t('settings.tasks.name')}</th>
                <th>{$i18n.t('settings.tasks.interval')}</th>
                <th>{$i18n.t('settings.tasks.last-execution')}</th>
                <th>{$i18n.t('settings.tasks.last-duration')}</th>
                <th>{$i18n.t('settings.tasks.next-execution')}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {#each data.tasks as task}
                <tr>
                    <td>{$i18n.t('tasks.' + task.id)}</td>
                    <td class="capitalize">
                        {cronstrue.toString(task.schedule, { locale: $i18n.language })}
                    </td>
                    <td class="capitalize">
                        {task.stats.lastExecution
                            ? intlFormatDistance(task.stats.lastExecution, new Date(), {
                                  locale: $i18n.language
                              })
                            : '-'}
                    </td>
                    <td>
                        <!-- TODO switch to Intl version as soon as it is released: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format -->
                        {task.stats.lastDuration
                            ? `${task.stats.lastDuration} ${$i18n.t('settings.tasks.milliseconds')}`
                            : '-'}
                    </td>
                    <td class="capitalize">
                        {task.stats.nextExecution
                            ? intlFormatDistance(task.stats.nextExecution, new Date(), {
                                  locale: $i18n.language
                              })
                            : '-'}
                    </td>
                    <td class="flex items-center justify-end gap-2">
                        <form method="post" use:enhance>
                            <input type="hidden" name="id" value={task.id} />
                            <button
                                type="submit"
                                formaction="?/runTask"
                                class="btn btn-sm variant-filled disabled:!opacity-100"
                                disabled={task.stats.running}
                            >
                                {#if task.stats.running}
                                    <ProgressRadial
                                        class="h-4 w-4"
                                        stroke={100}
                                        meter="stroke-surface-50 dark:stroke-surface-900"
                                        value={task.stats.progress === undefined ||
                                        task.stats.progress === null
                                            ? undefined
                                            : task.stats.progress * 100}
                                    />
                                {:else}
                                    <Play class="h-4 w-4" />
                                {/if}
                            </button>
                        </form>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
