import createTestBrim from "../helpers/createTestBrim"
import {createZealot} from "../../../zealot-old"
import {Readable} from "stream"
import {selectors} from "../helpers/integration"
import {poolItem} from "../helpers/locators"

describe("Handle Zed server events", () => {
  const zealot = createZealot("http://localhost:9867")
  const brim = createTestBrim("zed-events-tests")
  let poolId

  beforeAll(async () => {
    await brim.ingest("sample.zng")
    poolId = (await zealot.pools.list())[0].id
  })

  test("branch-commit", async () => {
    const data = new Readable()
    data._read = () => {}
    const loadPromise = zealot.pools.load(poolId, "main", {
      author: "itest author",
      body: "itest body",
      data
    })
    data.push(`{"testKey": "testValue"}`)
    data.push(null)
    await loadPromise

    await brim.waitForHTMLText(
      selectors.infoNotice,
      /More data is now available\./s
    )
  })

  test("pool-new/update/delete", async () => {
    const {
      pool: {id}
    } = await zealot.pools.create({name: "test-pool-new"})
    await brim.hasText("test-pool-new", poolItem)
    await zealot.pools.update(id, {name: "test-pool-update"})
    await brim.hasText("test-pool-update", poolItem)
    await zealot.pools.delete(id)
    await brim.withImplicitTimeout(500, async () => {
      expect(await brim.isNotVisible(poolItem)).toBe(true)
    })
  })
})
