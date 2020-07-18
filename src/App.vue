<template>
  <v-app>
    <v-card max-width="500" class="wrapper">
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>Todo List</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <v-list-item-content class="mr-5">
            <v-text-field label="要做些什麼？" v-model="name"></v-text-field>
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="indigo"
              @click="createList(name)"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item v-for="list in allList" :key="list.id">
          <v-list-item-icon>
            <v-btn
              icon
              v-if="list.done === true"
              @click="updateList(list.id, list.name, list.done)"
            >
              <v-icon>mdi-checkbox-marked</v-icon></v-btn
            >
            <v-btn
              icon
              v-else
              @click="updateList(list.id, list.name, list.done)"
            >
              <v-icon>mdi-checkbox-blank-outline</v-icon></v-btn
            >
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="list.name"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn icon @click="deleteList(list.id)">
              <v-icon color="red">mdi-trash-can-outline</v-icon></v-btn
            >
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-card>
  </v-app>
</template>
<script>
import firebase from './firebaseConfig'
import { Toast } from '../src/utils/helpers'

const db = firebase.firestore()
export default {
  data() {
    return {
      name: '',
      done: false,
      allList: [],
      search: '',
    }
  },
  mounted() {
    this.readList()
  },
  methods: {
    async readList() {
      try {
        let arr = []
        const querySnapshot = await db.collection('listItem').get()
        querySnapshot.forEach((doc) => {
          arr.push({
            id: doc.id,
            name: doc.data().name,
            done: doc.data().done,
          })
        })
        this.allList = Object.assign([], { ...this.allList, ...arr })
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: error,
        })
      }
    },
    async createList(name) {
      try {
        if (name !== '') {
          await db.collection('listItem').add({ name: name, done: false })
          this.name = ''
          this.readList()
        }
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: error,
        })
      }
    },
    async updateList(id, name, done) {
      try {
        await db
          .collection('listItem')
          .doc(id)
          .update({
            name: name,
            done: !done,
          })
          .then(() => {
            this.readList()
          })
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: error,
        })
      }
    },
    async deleteList(id) {
      try {
        await db
          .collection('listItem')
          .doc(id)
          .delete()
          .then(() => {
            let delIndex = this.allList.map((e) => e.id).indexOf(id)
            this.allList.splice(delIndex, 1)
            this.readList()
          })
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: error,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 50px auto;
  width: 400px;
}
</style>
