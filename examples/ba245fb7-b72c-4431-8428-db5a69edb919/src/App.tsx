import React, { useState, useEffect } from 'react';
import { Book, Send, Sparkles, AlertCircle } from 'lucide-react';

// 检查API密钥是否存在
const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY;
const hasApiKey = Boolean(API_KEY);

function App() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasApiKey) {
      setError("请先配置智谱AI API密钥。在项目根目录创建.env文件并添加：VITE_ZHIPU_API_KEY=your_api_key_here");
    }
  }, []);

  const interpretDream = async () => {
    if (!hasApiKey) {
      setError("未配置API密钥，无法进行梦境解析");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `作为一位专业的梦境分析师和心理咨询师，请对以下梦境进行深入分析。
梦境内容：${dream}

请从以下几个方面进行分析：
1. 梦境中的关键符号及其可能含义
2. 梦境反映的情感状态
3. 潜在的心理暗示
4. 与现实生活的可能联系
5. 个性化的心理调适建议

请用专业但易懂的语言回答，注意保持分析的客观性和建议的实用性。`;

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "glm-4",
          messages: [
            {
              role: "system",
              content: "你是一位专业的梦境分析师和心理咨询师，擅长解读梦境并提供心理调适建议。"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const interpretation = data.choices[0].message.content;
      setInterpretation(interpretation);
    } catch (err) {
      setError("抱歉，解析过程中出现错误。请稍后再试，或检查您的API密钥配置。");
      console.error('Dream interpretation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Book className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI梦境解读</h1>
          </div>
          <p className="text-gray-600">借助智谱GLM模型，探索您的梦境深层含义</p>
        </div>

        {!hasApiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <p>需要配置智谱AI API密钥才能使用此功能。请在项目根目录创建.env文件并添加：</p>
            </div>
            <code className="block mt-2 p-2 bg-yellow-100 rounded text-yellow-900">
              VITE_ZHIPU_API_KEY=your_api_key_here
            </code>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="请详细描述您的梦境，包括场景、人物、情感感受..."
            className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <button
            onClick={interpretDream}
            disabled={!dream.trim() || isLoading || !hasApiKey}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                正在解析...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                获取AI解析
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {interpretation && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">AI解析结果</h2>
            </div>
            <div className="prose prose-purple max-w-none">
              {interpretation.split('\n').map((line, index) => (
                <p key={index} className="mb-2 whitespace-pre-line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;