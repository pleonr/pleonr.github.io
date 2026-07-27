---
aside: false
outline: false
title: API de Tarefas
---

<script setup>
import { useRoute } from 'vitepress'
import spec from '../../public/openapi-tarefas.json'

const route = useRoute()

const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec" />
