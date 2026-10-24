import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { TEXT_GROUPS, TextGroupKey } from '../../content/texts';
import { Button } from '../../components/ui/Button';

interface AdminContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminContentModal: React.FC<AdminContentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { textDefs, texts, updateText, resetText, resetAllTexts, exportJson, importJson } = useContent();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);

  if (!isOpen) return null;

  const filteredDefs = textDefs.filter((def) => {
    const matchesGroup = selectedGroup === 'all' || def.group === selectedGroup;
    const matchesSearch =
      search.trim() === '' ||
      def.key.toLowerCase().includes(search.toLowerCase()) ||
      def.description.includes(search) ||
      (texts[def.key] || def.defaultValue).includes(search);
    return matchesGroup && matchesSearch;
  });

  const handleStartEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(texts[key] ?? '');
  };

  const handleSaveEdit = async () => {
    if (editingKey) {
      await updateText(editingKey, editValue);
      setEditingKey(null);
    }
  };

  const handleExport = async () => {
    const json = await exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azno-texts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importJson(content);
      if (res.success) {
        setImportStatus(`با موفقیت ${res.count} متن بروزرسانی شد.`);
      } else {
        setImportStatus(res.error || 'خطا در بارگذاری');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">پنل مدیریت محتوا و متن‌های اپ</h3>
            <span className="text-[11px] text-gray-500">
              ویرایش تمامی متون برنامه بدون نیاز به انتشار نسخه جدید
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Toolbar: Group filter & search */}
        <div className="py-3 border-b border-gray-100 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو در کلیدها، توضیحات یا متن..."
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D]"
            />

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#2F7D6D] bg-white"
            >
              <option value="all">همه دسته‌ها</option>
              {(Object.keys(TEXT_GROUPS) as TextGroupKey[]).map((grp) => (
                <option key={grp} value={grp}>
                  {TEXT_GROUPS[grp]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 text-[11px]">
              تعداد موارد: {filteredDefs.length}
            </span>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-[11px] text-[#2F7D6D] hover:underline font-medium">
                📥 ورودی JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleExport}
                className="text-[11px] text-[#2F7D6D] hover:underline font-medium"
              >
                📤 خروجی JSON
              </button>
            </div>
          </div>

          {importStatus && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg">
              {importStatus}
            </div>
          )}
        </div>

        {/* List of text definitions */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {filteredDefs.map((def) => {
            const currentValue = texts[def.key] ?? def.defaultValue;
            const isOverridden = texts[def.key] !== undefined && texts[def.key] !== def.defaultValue;
            const isEditing = editingKey === def.key;

            return (
              <div
                key={def.key}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  isOverridden ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-gray-800 text-[11px]">
                      {def.key}
                    </span>
                    {isOverridden && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                        تغییر یافته
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {TEXT_GROUPS[def.group]}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500 mb-1.5">{def.description}</div>

                {/* Placeholders note */}
                {def.placeholders && def.placeholders.length > 0 && (
                  <div className="text-[10px] text-emerald-700 mb-2">
                    متغیرهای مجاز: {def.placeholders.map((p) => `{${p}}`).join(' ')}
                  </div>
                )}

                {/* Editor view or text preview */}
                {isEditing ? (
                  <div className="space-y-2 mt-2">
                    {def.isMultiline ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                      />
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>
                        انصراف
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit}>
                        ذخیره
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-800 text-xs">
                      {currentValue}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      {isOverridden && (
                        <button
                          type="button"
                          onClick={() => resetText(def.key)}
                          className="text-[10px] text-gray-500 hover:text-gray-700 underline"
                        >
                          بازگشت به پیش‌فرض
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(def.key)}
                        className="text-[11px] text-[#2F7D6D] hover:underline font-semibold"
                      >
                        ویرایش
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          {showResetAllConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-600 font-bold">همه متن‌ها ریست شوند؟</span>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  await resetAllTexts();
                  setShowResetAllConfirm(false);
                }}
              >
                تایید ریست
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowResetAllConfirm(false)}>
                انصراف
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetAllConfirm(true)}
              className="text-[11px] text-rose-600 hover:underline"
            >
              بازنشانی همه متن‌ها به پیش‌فرض
            </button>
          )}

          <Button size="sm" variant="outline" onClick={onClose}>
            بستن پنل
          </Button>
        </div>
      </div>
    </div>
  );
};
