<template>
  <v-app>
    <v-card max-width="500" class="wrapper  mx-auto">
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>Todo List</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          clear-icon
          rounded
          solo
          dense
          light
          v-model="inputWord"
          label="找東西.."
          @input="findMatch(inputWord)"
          v-show="visible"
          class="mt-6 resize"
        ></v-text-field>

        <v-btn v-if="visible" icon @click="clear">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn v-else icon @click="visible = !visible">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item>
          <v-list-item-content class="mr-5">
            <v-text-field
              label="要做些什麼？"
              v-model="name"
              @keyup.enter="createList(name)"
            ></v-text-field>
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
        <template>
          <v-list-item v-if="displayedList.length < 1">
            <v-list-item-content>
              <v-list-item-title>沒有待辦事項唷！</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-for="list in displayedList" :key="list.id">
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
        </template>
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
      displayedList: [],
      search: '',
      staticArr: [],
      inputWord: '',
      visible: false,
    }
  },
  mounted() {
    this.readList('init')
  },
  methods: {
    async readList(con) {
      try {
        this.staticArr = []
        const querySnapshot = await db.collection('listItem').get()
        querySnapshot.forEach((doc) => {
          this.staticArr.push({
            id: doc.id,
            name: doc.data().name,
            done: doc.data().done,
          })
        })
        if (con === 'create' || con === 'init') {
          this.displayedList = Object.assign([], this.staticArr)
        }
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
          this.displayedList.push({ name: name, done: false })
          this.readList('create')
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
            done: !done,
          })
          .then(() => {
            let delIndex = this.displayedList.map((e) => e.id).indexOf(id)
            this.displayedList[delIndex].done = !this.displayedList[delIndex]
              .done
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
            let delIndex = this.displayedList.map((e) => e.id).indexOf(id)
            this.displayedList.splice(delIndex, 1)
            this.readList()
          })
      } catch (error) {
        Toast.fire({
          type: 'error',
          title: error,
        })
      }
    },
    findMatch(str) {
      this.displayedList =
        str.trim() !== ''
          ? this.staticArr.filter((item) => item.name.match(str))
          : JSON.parse(JSON.stringify(this.staticArr))
    },
    clear() {
      this.inputWord = ''
      this.visible = !this.visible
      this.displayedList = JSON.parse(JSON.stringify(this.staticArr))
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 50px auto;
  width: 350px;
}

.resize {
  width: 140px !important;
}
</style>
