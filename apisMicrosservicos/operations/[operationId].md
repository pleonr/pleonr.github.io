---
aside: false
outline: false
title: API de Usuários
---

<script setup>
import { useRoute } from 'vitepress'
import spec from '../../public/openapi-usuarios.json'

const route = useRoute()

const operationId = route.data.params.operationId
</script>

<OAOperation :operationId="operationId" :spec="spec" />
