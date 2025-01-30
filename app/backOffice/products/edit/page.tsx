"use client";
// react
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// redux
import { appearanceImageChange } from "@/lib/features/shopping/slice/ProductSlice";
import {
  fetchSupabaseData,
  addSupabaseData,
  updateSupabaseData,
  deleteSupabaseData,
} from "@/app/utils/supabaseFunk";
// icon
import { TrashIcon } from "@/public/icons/HeroIcons";
// css
import "@/sass/backOffice/edit.scss";
import { Modal } from "@/app/components/UI/modal";
import Link from "next/link";

// 型定義 ===========================================


// 更新用商品
interface editProductState {
  [key: number]: {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
  };
}
// 追加用商品
interface newProductData {
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const list = () => {
  /* state ===========================================*/
  // 商品
  const { productList } = useAppSelector((state) => state.product);
  // カテゴリー
  const { categoryList } = useAppSelector((state) => state.category);

  /* redux ===========================================*/
  const dispatch = useAppDispatch();

  /* hooks ===========================================*/
  // 編集したデータを保存(id:{key: value}で保存)
  const [editProductData, setEditProductData] = useState<editProductState>({});
  // 更新成功モーダル
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // 成功
  const [isSuccess, setIsSuccess] = useState(false);
  // 失敗
  const [isFailure, setIsFailure] = useState(false);
  // 追加確認モーダル
  const [isAddConfModalOpen, setIsAddConfModalOpen] = useState(false);
  // 未入力モーダル
  const [isNotEnteredModalOpen, setIsNotEnteredModalOpen] = useState(false);
  // 削除確認モーダル
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  // 削除番号
  const [deleteId, setDeleteId] = useState(0);

  // 初回レンダリング
  useEffect(() => {
    dispatch(fetchSupabaseData());
  }, []);

  /* 関数 ===========================================*/

  // TODO:商品の更新 ========================================================

  // 見た目画像の更新 --------------------------------
  // input要素
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  // 選択している画像id
  const [selectId, setSelectId] = useState(0);

  // ファイルを呼び出す
  const handleFileSelect = (id: number) => {
    inputFileRef.current?.click();
    setSelectId(id);
  };

  // 見た目の画像を変える
  const handleImageChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      // idをhandleFileSelectのidへ(ここでのidは商品数最後の数字になる)
      if (selectId > 0) {
        id = selectId;
      }
      const fileImage = e.target.files[0].name;
      // reduxで処理
      dispatch(appearanceImageChange({ id, fileImage }));
    }
  };

  // 説明入力欄の拡大 --------------------------------
  // 高さを広げる要素のid
  const [isExpandId, setIsExpandId] = useState(0);
  // 高さを広げる要素の真偽値
  const [isExpandState, setIsExpandState] = useState(false);
  const [isNewExpandState, setIsNewExpandState] = useState(false);

  // input要素をクリックしたときに幅を広げる関数
  const expandInput = (id: number) => {
    // 対象のid
    setIsExpandId(id);
    // 要素の伸び縮み
    setIsExpandState(!isExpandState);
    // もし対象のidでなければ
    if (isExpandId !== id) {
      // 要素の伸び縮み実行
      setIsExpandState(true);
    }
  };
  // 別の入力クリックと同時に開く
  useEffect(() => {
    // setIsExpandState(true)
  }, [isExpandState]);

  const [disableIds, setDisableIds] = useState<number[]>([]);

  // 商品内容の更新 ----------------------------------
  /**
   * 指定されたIDのオブジェクトの特定のフィールドを更新します。
   * @param {number} id - 更新するオブジェクトのID。
   * @param {string} field - 更新するフィールド名。
   * @param {string | number} value - 新しい値。
   */
  const handleInputChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    // 前のeditProductDataの状態をコピーして展開
    // オブジェクトID(メモリアドレス)を変わらないと更新の認識をされない。
    setEditProductData((prev) => ({
      ...prev,
      // 動的なobject生成(例: 1: {'name': 'carrot'})
      [id]: {
        // 動的生成された以前のobjectの状態を保ちつつ、変更箇所を更新(1: {'name': 'carrot'}を保ち、1: {'price': '100'}の操作が行われれば'name'と'price'の変更を行う。...prev[id]をしないと'price'の変更した時に'name'が上書きされ、更新されない。)
        ...prev[id],
        [field]: value,
      },
    }));

    // 元データ
    const originalData = productList.find((item) => item.id === id);
    // 元データとの変更あった場合
    const isChanged =
      originalData &&
      originalData[field as keyof typeof originalData] !== value;

    // updateボタンを有効にする
    setDisableIds((prev) => {
      if (isChanged && !prev.includes(id)) {
        return [...prev, id];
      } else if (!isChanged) {
        return prev.filter((currentId) => currentId !== id);
      }
      return prev;
    });
  };

  // 更新の実行 ----------------------------------
  const updateExecution = (id: number) => {
    const editData = editProductData[id] || {};
    const originalData = productList.find((item) => item.id === id);
    // 元データなければ
    if (!originalData) {
      throw new Error("error");
    }
    // 編集されているデータを優先
    const upDateProductData = {
      name: editData.name || originalData.name,
      price: editData.price || originalData.price,
      image: editData.image || originalData.image,
      category: editData.category || originalData.category,
      description: editData.description || originalData.description,
    };

    // 商品データの型(ユニオン型で取得)
    type ProductData = keyof typeof editData;
    // 変化があれば
    const hasChange = (
      ["name", "price", "image", "category", "description"] as ProductData[]
    ).some((field) => {
      // 編集のデータがundefinedではなく、元データが更新されていれば
      return (
        editData[field] !== undefined && editData[field] !== originalData[field]
      );
    });

    // 値に変化があれば
    if (hasChange) {
      dispatch(updateSupabaseData({ id, upDateProductData }))
        // createAsyncThunkの成功時の値を取得しやすく、失敗時にはエラーをスローするメソッド
        .unwrap()
        // 成功
        .then(() => {
          setIsUpdateModalOpen(true);
          setIsSuccess(true);
        })
        // 失敗
        .catch(() => {
          setIsUpdateModalOpen(true);
          setIsFailure(true);
        });
      // データを取得して画面に反映(originalData書き換え)
      dispatch(fetchSupabaseData());
    }
  };

  // 現在選択中の商品(idで管理)
  const [itemSelectedId, setItemSelectedId] = useState(0);

  // 選択中のリストに色をつける
  const handleSelectedItem = (id: number) => {
    setItemSelectedId(id);
  };

  // TODO:商品の追加 ========================================================

  // 見た目画像の更新 ----------------------------------
  // input要素
  const inputNewFileRef = useRef<HTMLInputElement | null>(null);
  // 見た目画像を変える
  const handleAddNewImage = () => {
    inputNewFileRef.current?.click();
  };

  // 追加する商品データ初期値
  const initialNewProductData = {
    name: "",
    price: 0,
    image: "",
    category: "",
    description: "",
  };

  // 追加商品の準備　----------------------------------
  // 追加する商品データ状態
  const [addNewProductData, setAddNewProductData] = useState<newProductData>(
    initialNewProductData
  );

  // 商品追加の処理
  const addNewProduct = (
    e:
      | ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>,
    field: string
  ) => {
    let value: string | number;
    if (field === "image") {
      // 型定義(変数化する必要あり)
      const input = e.target as HTMLInputElement;
      value = input.files?.[0].name ?? "";
    } else if (field === "price") {
      value = Number(e.target.value);
    } else {
      value = e.target.value;
    }
    // 動的fieldに値を保存
    setAddNewProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 追加の実行 ----------------------------------
  const addExecution = () => {
    // 入力欄が空又は0であればtrue
    const isNotEntered = Object.values(addNewProduct).some(
      (value) => value === "" || value === 1
    );

    if (isNotEntered) {
      setIsAddConfModalOpen(false);
      setIsNotEnteredModalOpen(true);
      // 追加処理を中止
      return;
    }

    dispatch(addSupabaseData({ addNewProductData })).then(() => {
      // データを取得して画面に反映
      dispatch(fetchSupabaseData());
      // モーダル閉じる
      setIsAddConfModalOpen(false);
      // 入力欄を全て空にする
      setAddNewProductData(initialNewProductData);
    });
  };

  // TODO:商品の削除 ========================================================

  // 削除の実行
  const deleteExecution = (id: number) => {
    dispatch(deleteSupabaseData(id))
      // createAsyncThunkの成功時の値を取得しやすく、失敗時にはエラーをスローするメソッド
      .unwrap()
      .then(() => {
        // データを取得して画面に反映
        dispatch(fetchSupabaseData());
        // モーダル閉じて
        setIsDeleteConfModalOpen(false);
        // 削除番号初期化
        setDeleteId(0);
      });
  };

  return (
    <div className="update">
      <div className="title">更新データ</div>
      <div className="updateProduct">
        {/* 項目名 */}
        <ul className="field">
          <li className="id">ID</li>
          <li className="name">名前</li>
          <li className="price">値段</li>
          <li className="img">画像</li>
          <li className="category">分類</li>
          <li className="description">説明</li>
          <li className="edit">更新</li>
          <li className="delete">削除</li>
        </ul>

        {/* 商品一覧 */}
        <ul className="productList">
          {[...productList]
            // id順
            .sort((a, b) => a.id - b.id)
            .map((item) => (
              <li
                className={`eachProduct ${itemSelectedId === item.id ? "isSelected" : ""}`}
                onClick={() => handleSelectedItem(item.id)}
                key={item.id}
              >
                {/* id */}
                <div className="id">{item.id}</div>
                {/* 名前 */}
                <div className="name">
                  <input
                    onChange={(e) => {
                      handleInputChange(item.id, "name", e.target.value);
                      // handleUpdateChanged(item.id);
                    }}
                    defaultValue={item.name}
                  />
                </div>
                {/* 値段 */}
                <div className="price">
                  <input
                    type="number"
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        "price",
                        Number(e.target.value)
                      )
                    }
                    defaultValue={item.price}
                    min="0"
                    step="10"
                  />
                </div>
                {/* 画像 */}
                <div className="image">
                  <img src={`/images/${item.image}`} />
                  <input
                    type="file"
                    ref={inputFileRef}
                    onChange={(e) => {
                      // 画像をdbで差し替える
                      handleInputChange(
                        item.id,
                        "image",
                        e.target.files ? e.target.files[0].name : ""
                      );
                      // 見た目の画像を変える
                      handleImageChange(item.id, e);
                    }}
                    accept=".png"
                    style={{
                      display: "none",
                    }}
                  />
                  <button
                    className="fileSelectBtn"
                    onClick={() => handleFileSelect(item.id)}
                  >
                    選ぶ
                  </button>
                </div>
                {/* カテゴリー */}
                <div className="category">
                  <select
                    onChange={(e) =>
                      handleInputChange(item.id, "category", e.target.value)
                    }
                    // 各カテゴリーに合うものを表示
                    defaultValue={item.category}
                  >
                    {categoryList.map((category) => {
                      return <option key={category}>{category}</option>;
                    })}
                  </select>
                </div>
                {/* 説明 */}
                <div className="description">
                  <textarea
                    className={`${item.id === isExpandId && isExpandState ? "isExpand" : ""}`}
                    onChange={(e) =>
                      handleInputChange(item.id, "description", e.target.value)
                    }
                    onClick={() => expandInput(item.id)}
                    defaultValue={item.description}
                  />
                </div>

                {/* アップデートボタン */}
                <div className="_update">
                  <button
                    className={`updateBtn ${disableIds.includes(item.id) ? "" : "isDisable"}`}
                    onClick={() => updateExecution(item.id)}
                  >
                    更新
                  </button>
                </div>

                {/* 削除ボタン */}
                <div className="_delete">
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      setIsDeleteConfModalOpen(true);
                      setDeleteId(item.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          <li className="addProduct">
            <div className="newId"></div>
            <div className="newName">
              <input
                onChange={(e) => addNewProduct(e, "name")}
                value={addNewProductData.name}
              />
            </div>
            {/* 新しい値段 */}
            <div className="newPrice">
              <input
                type="number"
                min={0}
                step={10}
                onChange={(e) => addNewProduct(e, "price")}
                value={addNewProductData.price}
              />
            </div>
            {/* 新しい画像 */}
            <div className="newImage">
              {addNewProductData.image && (
                <img
                  src={`/images/${addNewProductData.image}`}
                  alt="newImage"
                />
              )}

              <input
                type="file"
                onChange={(e) => addNewProduct(e, "image")}
                ref={inputNewFileRef}
                accept=".png"
                style={{
                  display: "none",
                }}
              />
              <button
                className="newFileSelectBtn"
                onClick={() => handleAddNewImage()}
              >
                選ぶ
              </button>
            </div>
            {/* 新しいカテゴリー */}
            <div className="newCategory">
              <select
                onChange={(e) => addNewProduct(e, "category")}
                value={addNewProductData.category}
              >
                {categoryList.map((category) => {
                  return <option key={category}>{category}</option>;
                })}
              </select>
            </div>

            {/* 新しい説明 */}
            <div className="newDescription">
              <textarea
                className={`${isNewExpandState ? "isExpand" : ""}`}
                onChange={(e) => addNewProduct(e, "description")}
                onClick={() => setIsNewExpandState(!isNewExpandState)}
                value={addNewProductData.description}
              ></textarea>
            </div>
            <div className="add">
              <button
                className="addBtn"
                onClick={() => setIsAddConfModalOpen(true)}
              >
                追加する
              </button>
            </div>
            <div className="goShop">
              <div className="goShopBtn">
                <Link href="/product">商品一覧に戻る</Link>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* モーダル */}
      <>
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsDeleteConfModalOpen(false);
            setDeleteId(0);
            setIsSuccess(false);
            setIsFailure(false);
          }}
          className="updateModal"
        >
          {isSuccess ? <p>変更しました</p> : <p></p>}
          {isFailure ? <p>変更できませんでした</p> : <p></p>}
          <button
            className="closeBtn"
            onClick={() => {
              setIsUpdateModalOpen(false);
              setIsSuccess(false);
              setIsFailure(false);
            }}
          >
            閉じる
          </button>
        </Modal>

        {/* 未入力 */}
        <Modal
          isOpen={isNotEnteredModalOpen}
          onClose={() => {
            setIsNotEnteredModalOpen(false);
          }}
          className="notEnteredModal"
        >
          未入力の部分があります。
          <button
            className="closeBtn"
            onClick={() => {
              setIsNotEnteredModalOpen(false);
            }}
          >
            閉じる
          </button>
        </Modal>

        {/* 追加 */}
        <Modal
          isOpen={isAddConfModalOpen}
          onClose={() => setIsAddConfModalOpen(false)}
          className="deleteConfModal"
        >
          <p>商品を加えますか?</p>
          <div className="btnBlock">
            <button className="yesBtn" onClick={addExecution}>
              はい
            </button>
            <button
              className="noBtn"
              onClick={() => {
                setIsAddConfModalOpen(false);
              }}
            >
              いいえ
            </button>
          </div>
        </Modal>

        {/* 削除 */}
        <Modal
          isOpen={isDeleteConfModalOpen}
          onClose={() => {
            setIsDeleteConfModalOpen(false);
            setDeleteId(0);
          }}
          className="deleteConfModal"
        >
          <p>削除しますか?</p>
          <div className="btnBlock">
            <button
              className="yesBtn"
              onClick={() => deleteExecution(deleteId)}
            >
              はい
            </button>
            <button
              className="noBtn"
              onClick={() => {
                setIsDeleteConfModalOpen(false);
                setDeleteId(0);
              }}
            >
              いいえ
            </button>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default list;